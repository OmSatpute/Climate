import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth';
import footprintRoutes from './routes/footprints';
import riskRoutes from './routes/risk';
import regionRoutes from './routes/regions';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/footprints', footprintRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/regions', regionRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Carbon Risk Tracker API',
    version: '1.0.0',
    description: 'Backend API for Carbon → Humanitarian Risk Tracker',
    endpoints: {
      auth: {
        'POST /api/auth/signup': 'Create a new user account',
        'POST /api/auth/login': 'Authenticate user and get JWT token'
      },
      footprints: {
        'GET /api/footprints/summary': 'Get carbon footprint summary by period',
        'POST /api/footprints/import': 'Import footprints from CSV file',
        'GET /api/footprints': 'Get user footprints with pagination',
        'DELETE /api/footprints/:id': 'Delete a specific footprint'
      },
      risk: {
        'POST /api/risk/evaluate': 'Evaluate humanitarian risk for given footprints and regions',
        'GET /api/risk/signals/footprint/:id': 'Get risk signals for a specific footprint',
        'GET /api/risk/signals/region/:id': 'Get risk signals for a specific region'
      },
      regions: {
        'GET /api/regions': 'Get list of regions with vulnerability data',
        'GET /api/regions/:id': 'Get specific region details',
        'GET /api/regions/stats/summary': 'Get regions statistics summary'
      }
    },
    authentication: 'JWT Bearer token required for protected endpoints',
    csvFormat: {
      description: 'CSV files should have columns: category, amount, unit, date, description',
      example: 'transport,100,km,2024-01-15,Commute to work'
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Carbon Risk Tracker API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
