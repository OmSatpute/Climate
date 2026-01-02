import Database from './connection';

const regionsData = [
  {
    name: 'Bangladesh',
    iso_code: 'BGD',
    vulnerability_index: 0.85,
    population: 164700000,
    base_hazard_prob: {
      flood: 0.3,
      drought: 0.15,
      heatwave: 0.25,
      storm: 0.4
    },
    exposure_fraction: 0.6
  },
  {
    name: 'Philippines',
    iso_code: 'PHL',
    vulnerability_index: 0.78,
    population: 109600000,
    base_hazard_prob: {
      flood: 0.35,
      drought: 0.1,
      heatwave: 0.2,
      storm: 0.45
    },
    exposure_fraction: 0.55
  },
  {
    name: 'Haiti',
    iso_code: 'HTI',
    vulnerability_index: 0.82,
    population: 11400000,
    base_hazard_prob: {
      flood: 0.25,
      drought: 0.2,
      heatwave: 0.3,
      storm: 0.35
    },
    exposure_fraction: 0.7
  },
  {
    name: 'Mozambique',
    iso_code: 'MOZ',
    vulnerability_index: 0.75,
    population: 31200000,
    base_hazard_prob: {
      flood: 0.4,
      drought: 0.25,
      heatwave: 0.2,
      storm: 0.3
    },
    exposure_fraction: 0.65
  },
  {
    name: 'Myanmar',
    iso_code: 'MMR',
    vulnerability_index: 0.72,
    population: 54400000,
    base_hazard_prob: {
      flood: 0.3,
      drought: 0.2,
      heatwave: 0.25,
      storm: 0.35
    },
    exposure_fraction: 0.5
  },
  {
    name: 'Somalia',
    iso_code: 'SOM',
    vulnerability_index: 0.88,
    population: 15800000,
    base_hazard_prob: {
      flood: 0.15,
      drought: 0.5,
      heatwave: 0.4,
      storm: 0.2
    },
    exposure_fraction: 0.8
  },
  {
    name: 'Afghanistan',
    iso_code: 'AFG',
    vulnerability_index: 0.8,
    population: 38900000,
    base_hazard_prob: {
      flood: 0.2,
      drought: 0.4,
      heatwave: 0.3,
      storm: 0.15
    },
    exposure_fraction: 0.75
  },
  {
    name: 'Yemen',
    iso_code: 'YEM',
    vulnerability_index: 0.85,
    population: 29800000,
    base_hazard_prob: {
      flood: 0.1,
      drought: 0.6,
      heatwave: 0.35,
      storm: 0.15
    },
    exposure_fraction: 0.7
  },
  {
    name: 'Niger',
    iso_code: 'NER',
    vulnerability_index: 0.83,
    population: 24200000,
    base_hazard_prob: {
      flood: 0.2,
      drought: 0.45,
      heatwave: 0.4,
      storm: 0.1
    },
    exposure_fraction: 0.8
  },
  {
    name: 'Mali',
    iso_code: 'MLI',
    vulnerability_index: 0.79,
    population: 20200000,
    base_hazard_prob: {
      flood: 0.15,
      drought: 0.4,
      heatwave: 0.35,
      storm: 0.1
    },
    exposure_fraction: 0.75
  },
  {
    name: 'Chad',
    iso_code: 'TCD',
    vulnerability_index: 0.81,
    population: 16400000,
    base_hazard_prob: {
      flood: 0.25,
      drought: 0.35,
      heatwave: 0.3,
      storm: 0.15
    },
    exposure_fraction: 0.8
  },
  {
    name: 'Burkina Faso',
    iso_code: 'BFA',
    vulnerability_index: 0.77,
    population: 20900000,
    base_hazard_prob: {
      flood: 0.2,
      drought: 0.35,
      heatwave: 0.3,
      storm: 0.15
    },
    exposure_fraction: 0.7
  },
  {
    name: 'South Sudan',
    iso_code: 'SSD',
    vulnerability_index: 0.84,
    population: 11100000,
    base_hazard_prob: {
      flood: 0.3,
      drought: 0.25,
      heatwave: 0.25,
      storm: 0.2
    },
    exposure_fraction: 0.75
  },
  {
    name: 'Central African Republic',
    iso_code: 'CAF',
    vulnerability_index: 0.8,
    population: 4800000,
    base_hazard_prob: {
      flood: 0.2,
      drought: 0.3,
      heatwave: 0.3,
      storm: 0.2
    },
    exposure_fraction: 0.7
  },
  {
    name: 'Democratic Republic of Congo',
    iso_code: 'COD',
    vulnerability_index: 0.76,
    population: 89500000,
    base_hazard_prob: {
      flood: 0.25,
      drought: 0.2,
      heatwave: 0.25,
      storm: 0.2
    },
    exposure_fraction: 0.6
  }
];

async function seedDatabase() {
  const db = Database.getInstance();
  
  try {
    console.log('Seeding database with regions data...');
    
    // Clear existing regions
    await db.query('DELETE FROM regions');
    
    // Insert regions
    for (const region of regionsData) {
      await db.query(
        `INSERT INTO regions (name, iso_code, vulnerability_index, population, base_hazard_prob, exposure_fraction)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          region.name,
          region.iso_code,
          region.vulnerability_index,
          region.population,
          JSON.stringify(region.base_hazard_prob),
          region.exposure_fraction
        ]
      );
    }
    
    console.log(`✅ Seeded ${regionsData.length} regions successfully`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  seedDatabase();
}
