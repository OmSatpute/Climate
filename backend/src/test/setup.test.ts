import { describe, it, expect } from '@jest/globals';
import { EmissionCalculator } from '../services/emissionCalculator';

describe('Emission Calculator', () => {
  const calculator = new EmissionCalculator();

  it('should calculate car transport emissions correctly', () => {
    const emission = calculator.calculateEmission('transport', 100, 'km', { transport_type: 'car' });
    expect(emission).toBeCloseTo(19.2, 1); // 100 km * 0.192 kgCO2/km
  });

  it('should calculate electricity emissions correctly', () => {
    const emission = calculator.calculateEmission('energy', 50, 'kWh');
    expect(emission).toBeCloseTo(23.75, 1); // 50 kWh * 0.475 kgCO2/kWh
  });

  it('should calculate beef food emissions correctly', () => {
    const emission = calculator.calculateEmission('food', 2, 'kg', { food_type: 'beef' });
    expect(emission).toBeCloseTo(54, 1); // 2 kg * 27 kgCO2/kg
  });

  it('should handle unit conversions', () => {
    const emissionKm = calculator.calculateEmission('transport', 100, 'km', { transport_type: 'car' });
    const emissionMiles = calculator.calculateEmission('transport', 62.137, 'miles', { transport_type: 'car' });
    expect(emissionKm).toBeCloseTo(emissionMiles, 1);
  });
});

describe('CSV Parser', () => {
  it('should parse CSV row correctly', () => {
    const calculator = new EmissionCalculator();
    const csvRow = {
      category: 'transport',
      amount: 100,
      unit: 'km',
      date: '2024-01-15',
      description: 'Commute to work',
      transport_type: 'car'
    };

    const footprint = calculator.parseCSVRow(csvRow);
    expect(footprint.category).toBe('transport');
    expect(footprint.co2_kg).toBeCloseTo(19.2, 1);
    expect(footprint.date).toEqual(new Date('2024-01-15'));
    expect(footprint.meta?.description).toBe('Commute to work');
  });
});
