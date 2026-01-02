-- Create database schema for Carbon Risk Tracker

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Footprints table
CREATE TABLE IF NOT EXISTS footprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('transport', 'energy', 'food', 'purchase', 'other')),
    co2_kg DECIMAL(10, 4) NOT NULL,
    date DATE NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    iso_code VARCHAR(3) UNIQUE NOT NULL,
    vulnerability_index DECIMAL(3, 2) NOT NULL CHECK (vulnerability_index >= 0 AND vulnerability_index <= 1),
    population INTEGER NOT NULL,
    base_hazard_prob JSONB NOT NULL,
    exposure_fraction DECIMAL(3, 2) NOT NULL CHECK (exposure_fraction >= 0 AND exposure_fraction <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk signals table
CREATE TABLE IF NOT EXISTS risk_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    footprint_id UUID NOT NULL REFERENCES footprints(id) ON DELETE CASCADE,
    region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    risk_type VARCHAR(20) NOT NULL CHECK (risk_type IN ('flood', 'drought', 'heatwave', 'storm')),
    risk_score DECIMAL(3, 2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),
    explanation TEXT NOT NULL,
    people_at_risk INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_footprints_user_id ON footprints(user_id);
CREATE INDEX IF NOT EXISTS idx_footprints_date ON footprints(date);
CREATE INDEX IF NOT EXISTS idx_footprints_category ON footprints(category);
CREATE INDEX IF NOT EXISTS idx_risk_signals_footprint_id ON risk_signals(footprint_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_region_id ON risk_signals(region_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_risk_type ON risk_signals(risk_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footprints_updated_at BEFORE UPDATE ON footprints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_signals_updated_at BEFORE UPDATE ON risk_signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
