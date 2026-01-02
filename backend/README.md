# Carbon Risk Tracker Backend

A Node.js + Express (TypeScript) backend for the Carbon → Humanitarian Risk Tracker web application.

## Features

- **JWT-based Authentication**: Secure user signup and login
- **Carbon Footprint Management**: Import, calculate, and track carbon emissions
- **Risk Evaluation Engine**: Rule-based humanitarian risk assessment
- **CSV Import**: Bulk import of carbon footprint data
- **Regional Vulnerability Data**: Pre-seeded regions with vulnerability indices

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user and get JWT token

### Carbon Footprints
- `GET /api/footprints/summary?period=30d` - Get footprint summary by period
- `POST /api/footprints/import` - Import footprints from CSV file
- `GET /api/footprints` - Get user footprints with pagination
- `DELETE /api/footprints/:id` - Delete specific footprint

### Risk Evaluation
- `POST /api/risk/evaluate` - Evaluate humanitarian risk
- `GET /api/risk/signals/footprint/:id` - Get risk signals for footprint
- `GET /api/risk/signals/region/:id` - Get risk signals for region

### Regions
- `GET /api/regions` - List regions with vulnerability data
- `GET /api/regions/:id` - Get specific region details
- `GET /api/regions/stats/summary` - Get regions statistics

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your database credentials
```

3. **Set up PostgreSQL database:**
```bash
# Create database
createdb carbon_risk_tracker

# Run migrations
npm run db:migrate

# Seed with regions data
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/carbon_risk_tracker
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carbon_risk_tracker
DB_USER=username
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## CSV Import Format

CSV files should have the following columns:

```csv
category,amount,unit,date,description
transport,100,km,2024-01-15,Commute to work
energy,50,kWh,2024-01-15,Electricity usage
food,2,kg,2024-01-15,Beef consumption
purchase,100,USD,2024-01-15,Online shopping
```

### Categories
- `transport` - Transportation emissions
- `energy` - Energy consumption
- `food` - Food consumption
- `purchase` - Purchases and consumption
- `other` - Other activities

### Units
- Distance: `km`, `miles`, `m`
- Energy: `kWh`, `MJ`, `BTU`
- Weight: `kg`, `lb`, `g`
- Currency: `USD`, `EUR`, `GBP`

## Emission Factors

The system uses the following emission factors:

- **Car (petrol)**: 0.192 kgCO₂/km
- **Bus**: 0.105 kgCO₂/km
- **Short flight**: 0.15 kgCO₂/km
- **Electricity**: 0.475 kgCO₂/kWh
- **Beef**: 27 kgCO₂/kg
- **Generic purchase**: 0.0005 tCO₂/USD

## Risk Calculation

The risk engine uses a rule-based approach:

```
delta_temp = total_emissions_tons * ALPHA (1e-6)
hazard_likelihood = base_prob * (1 + BETA[hazard] * delta_temp)
risk_score = min(1.0, hazard_likelihood * vulnerability_index)
people_at_risk = risk_score * population * exposure_fraction
```

Where:
- `ALPHA = 1e-6` (temperature increase per ton CO₂)
- `BETA` varies by hazard type (flood: 0.1, drought: 0.15, heatwave: 0.2, storm: 0.12)

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `role` (VARCHAR: 'user' | 'admin')
- `created_at`, `updated_at` (TIMESTAMP)

### Footprints
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `category` (VARCHAR: transport|energy|food|purchase|other)
- `co2_kg` (DECIMAL)
- `date` (DATE)
- `meta` (JSONB)
- `created_at`, `updated_at` (TIMESTAMP)

### Regions
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `iso_code` (VARCHAR, Unique)
- `vulnerability_index` (DECIMAL 0-1)
- `population` (INTEGER)
- `base_hazard_prob` (JSONB)
- `exposure_fraction` (DECIMAL 0-1)
- `created_at`, `updated_at` (TIMESTAMP)

### Risk Signals
- `id` (UUID, Primary Key)
- `footprint_id` (UUID, Foreign Key)
- `region_id` (UUID, Foreign Key)
- `risk_type` (VARCHAR: flood|drought|heatwave|storm)
- `risk_score` (DECIMAL 0-1)
- `explanation` (TEXT)
- `people_at_risk` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with regions data

## API Documentation

Visit `http://localhost:3001/api` for interactive API documentation.

## Health Check

Visit `http://localhost:3001/health` to check server status.
