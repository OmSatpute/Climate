export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Footprint {
  id: string;
  user_id: string;
  category: 'transport' | 'energy' | 'food' | 'purchase' | 'other';
  co2_kg: number;
  date: Date;
  meta: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Region {
  id: string;
  name: string;
  iso_code: string;
  vulnerability_index: number;
  population: number;
  base_hazard_prob: {
    flood: number;
    drought: number;
    heatwave: number;
    storm: number;
  };
  exposure_fraction: number;
  created_at: Date;
  updated_at: Date;
}

export interface RiskSignal {
  id: string;
  footprint_id: string;
  region_id: string;
  risk_type: 'flood' | 'drought' | 'heatwave' | 'storm';
  risk_score: number;
  explanation: string;
  people_at_risk: number;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface EmissionFactor {
  car_petrol: number;
  bus: number;
  short_flight: number;
  electricity: number;
  beef: number;
  generic_purchase: number;
}

export interface RiskEvaluationRequest {
  footprint_ids: string[];
  region_ids: string[];
}

export interface RiskEvaluationResponse {
  risk_signals: RiskSignal[];
  total_people_at_risk: number;
  summary: {
    region_id: string;
    region_name: string;
    total_risk_score: number;
    people_at_risk: number;
  }[];
}

export interface FootprintSummary {
  category: string;
  total_co2_kg: number;
  count: number;
  period: string;
}

export interface CSVRow {
  category: string;
  amount: number;
  unit: string;
  date: string;
  description?: string;
  [key: string]: any;
}
