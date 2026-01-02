import Database from '../database/connection';
import { Footprint, Region, RiskSignal, RiskEvaluationRequest, RiskEvaluationResponse } from '../types';

export class RiskEngine {
  private db = Database.getInstance();
  
  // Risk calculation constants
  private readonly ALPHA = 1e-6; // Temperature increase per ton of CO2
  private readonly BETA = {
    flood: 0.1,
    drought: 0.15,
    heatwave: 0.2,
    storm: 0.12
  };

  async evaluateRisk(request: RiskEvaluationRequest): Promise<RiskEvaluationResponse> {
    const { footprint_ids, region_ids } = request;

    // Get footprints and regions
    const footprints = await this.getFootprintsByIds(footprint_ids);
    const regions = await this.getRegionsByIds(region_ids);

    if (footprints.length === 0) {
      throw new Error('No valid footprints found');
    }

    if (regions.length === 0) {
      throw new Error('No valid regions found');
    }

    // Calculate total emissions in tons
    const totalEmissionsTons = footprints.reduce((sum, footprint) => sum + footprint.co2_kg, 0) / 1000;

    const riskSignals: RiskSignal[] = [];
    const summary: RiskEvaluationResponse['summary'] = [];

    // Calculate risk for each region
    for (const region of regions) {
      let regionTotalRiskScore = 0;
      let regionPeopleAtRisk = 0;

      // Calculate risk for each hazard type
      for (const hazardType of ['flood', 'drought', 'heatwave', 'storm'] as const) {
        const riskSignal = await this.calculateRiskSignal(
          footprints,
          region,
          hazardType,
          totalEmissionsTons
        );

        if (riskSignal) {
          riskSignals.push(riskSignal);
          regionTotalRiskScore += riskSignal.risk_score;
          regionPeopleAtRisk += riskSignal.people_at_risk;
        }
      }

      summary.push({
        region_id: region.id,
        region_name: region.name,
        total_risk_score: Math.min(1.0, regionTotalRiskScore),
        people_at_risk: Math.round(regionPeopleAtRisk)
      });
    }

    // Save risk signals to database
    await this.saveRiskSignals(riskSignals);

    const totalPeopleAtRisk = summary.reduce((sum, item) => sum + item.people_at_risk, 0);

    return {
      risk_signals: riskSignals,
      total_people_at_risk: totalPeopleAtRisk,
      summary
    };
  }

  private async calculateRiskSignal(
    footprints: Footprint[],
    region: Region,
    hazardType: 'flood' | 'drought' | 'heatwave' | 'storm',
    totalEmissionsTons: number
  ): Promise<RiskSignal | null> {
    // Calculate temperature increase
    const deltaTemp = totalEmissionsTons * this.ALPHA;

    // Get base hazard probability for this region and hazard type
    const baseProb = region.base_hazard_prob[hazardType];
    if (!baseProb) {
      return null;
    }

    // Calculate hazard likelihood
    const hazardLikelihood = baseProb * (1 + this.BETA[hazardType] * deltaTemp);

    // Calculate risk score
    const riskScore = Math.min(1.0, hazardLikelihood * region.vulnerability_index);

    // Calculate people at risk
    const peopleAtRisk = riskScore * region.population * region.exposure_fraction;

    // Generate explanation
    const explanation = this.generateExplanation(
      region,
      hazardType,
      totalEmissionsTons,
      deltaTemp,
      baseProb,
      hazardLikelihood,
      riskScore,
      peopleAtRisk
    );

    // Create risk signal (we'll save it later)
    const riskSignal: Omit<RiskSignal, 'id' | 'created_at' | 'updated_at'> = {
      footprint_id: footprints[0].id, // Use first footprint as representative
      region_id: region.id,
      risk_type: hazardType,
      risk_score: riskScore,
      explanation,
      people_at_risk: Math.round(peopleAtRisk)
    };

    return riskSignal as RiskSignal;
  }

  private generateExplanation(
    region: Region,
    hazardType: string,
    totalEmissionsTons: number,
    deltaTemp: number,
    baseProb: number,
    hazardLikelihood: number,
    riskScore: number,
    peopleAtRisk: number
  ): string {
    const hazardName = hazardType.charAt(0).toUpperCase() + hazardType.slice(1);
    
    return `${hazardName} risk assessment for ${region.name}:
- Total emissions: ${totalEmissionsTons.toFixed(2)} tons CO2
- Temperature increase: ${(deltaTemp * 1000).toFixed(4)}°C
- Base ${hazardType} probability: ${(baseProb * 100).toFixed(1)}%
- Adjusted probability: ${(hazardLikelihood * 100).toFixed(1)}%
- Vulnerability index: ${(region.vulnerability_index * 100).toFixed(1)}%
- Risk score: ${(riskScore * 100).toFixed(1)}%
- People at risk: ${Math.round(peopleAtRisk).toLocaleString()}`;
  }

  private async getFootprintsByIds(footprintIds: string[]): Promise<Footprint[]> {
    if (footprintIds.length === 0) return [];

    const placeholders = footprintIds.map((_, index) => `$${index + 1}`).join(',');
    const result = await this.db.query(
      `SELECT * FROM footprints WHERE id IN (${placeholders})`,
      footprintIds
    );

    return result.rows;
  }

  private async getRegionsByIds(regionIds: string[]): Promise<Region[]> {
    if (regionIds.length === 0) return [];

    const placeholders = regionIds.map((_, index) => `$${index + 1}`).join(',');
    const result = await this.db.query(
      `SELECT * FROM regions WHERE id IN (${placeholders})`,
      regionIds
    );

    return result.rows;
  }

  private async saveRiskSignals(riskSignals: RiskSignal[]): Promise<void> {
    if (riskSignals.length === 0) return;

    for (const signal of riskSignals) {
      await this.db.query(
        `INSERT INTO risk_signals (footprint_id, region_id, risk_type, risk_score, explanation, people_at_risk)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          signal.footprint_id,
          signal.region_id,
          signal.risk_type,
          signal.risk_score,
          signal.explanation,
          signal.people_at_risk
        ]
      );
    }
  }

  async getRiskSignalsByFootprint(footprintId: string): Promise<RiskSignal[]> {
    const result = await this.db.query(
      `SELECT rs.*, r.name as region_name, f.category as footprint_category
       FROM risk_signals rs
       JOIN regions r ON rs.region_id = r.id
       JOIN footprints f ON rs.footprint_id = f.id
       WHERE rs.footprint_id = $1
       ORDER BY rs.risk_score DESC`,
      [footprintId]
    );

    return result.rows;
  }

  async getRiskSignalsByRegion(regionId: string): Promise<RiskSignal[]> {
    const result = await this.db.query(
      `SELECT rs.*, r.name as region_name, f.category as footprint_category
       FROM risk_signals rs
       JOIN regions r ON rs.region_id = r.id
       JOIN footprints f ON rs.footprint_id = f.id
       WHERE rs.region_id = $1
       ORDER BY rs.risk_score DESC`,
      [regionId]
    );

    return result.rows;
  }
}
