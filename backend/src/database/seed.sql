-- Seed data for regions
INSERT INTO regions (name, iso_code, vulnerability_index, population, base_hazard_prob, exposure_fraction) VALUES
('Bangladesh', 'BGD', 0.85, 164700000, '{"flood": 0.3, "drought": 0.15, "heatwave": 0.25, "storm": 0.4}', 0.6),
('Philippines', 'PHL', 0.78, 109600000, '{"flood": 0.35, "drought": 0.1, "heatwave": 0.2, "storm": 0.45}', 0.55),
('Haiti', 'HTI', 0.82, 11400000, '{"flood": 0.25, "drought": 0.2, "heatwave": 0.3, "storm": 0.35}', 0.7),
('Mozambique', 'MOZ', 0.75, 31200000, '{"flood": 0.4, "drought": 0.25, "heatwave": 0.2, "storm": 0.3}', 0.65),
('Myanmar', 'MMR', 0.72, 54400000, '{"flood": 0.3, "drought": 0.2, "heatwave": 0.25, "storm": 0.35}', 0.5),
('Somalia', 'SOM', 0.88, 15800000, '{"flood": 0.15, "drought": 0.5, "heatwave": 0.4, "storm": 0.2}', 0.8),
('Afghanistan', 'AFG', 0.8, 38900000, '{"flood": 0.2, "drought": 0.4, "heatwave": 0.3, "storm": 0.15}', 0.75),
('Yemen', 'YEM', 0.85, 29800000, '{"flood": 0.1, "drought": 0.6, "heatwave": 0.35, "storm": 0.15}', 0.7),
('Niger', 'NER', 0.83, 24200000, '{"flood": 0.2, "drought": 0.45, "heatwave": 0.4, "storm": 0.1}', 0.8),
('Mali', 'MLI', 0.79, 20200000, '{"flood": 0.15, "drought": 0.4, "heatwave": 0.35, "storm": 0.1}', 0.75),
('Chad', 'TCD', 0.81, 16400000, '{"flood": 0.25, "drought": 0.35, "heatwave": 0.3, "storm": 0.15}', 0.8),
('Burkina Faso', 'BFA', 0.77, 20900000, '{"flood": 0.2, "drought": 0.35, "heatwave": 0.3, "storm": 0.15}', 0.7),
('South Sudan', 'SSD', 0.84, 11100000, '{"flood": 0.3, "drought": 0.25, "heatwave": 0.25, "storm": 0.2}', 0.75),
('Central African Republic', 'CAF', 0.8, 4800000, '{"flood": 0.2, "drought": 0.3, "heatwave": 0.3, "storm": 0.2}', 0.7),
('Democratic Republic of Congo', 'COD', 0.76, 89500000, '{"flood": 0.25, "drought": 0.2, "heatwave": 0.25, "storm": 0.2}', 0.6);
