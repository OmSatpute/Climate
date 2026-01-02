#!/bin/bash

echo "🚀 Setting up Carbon Risk Tracker Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials before continuing."
    echo "   You can run this script again after updating .env"
    exit 0
fi

# Load environment variables
source .env

# Check if database exists
echo "🗄️  Checking database connection..."
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c '\q' 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database. Please check your .env file and ensure:"
    echo "   1. PostgreSQL is running"
    echo "   2. Database '$DB_NAME' exists"
    echo "   3. User '$DB_USER' has access to the database"
    echo "   4. Connection details in .env are correct"
    exit 1
fi

# Run migrations
echo "🔄 Running database migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database with regions data..."
npm run db:seed

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the development server with:"
echo "   npm run dev"
echo ""
echo "📊 API will be available at: http://localhost:${PORT:-3001}"
echo "📖 API Documentation: http://localhost:${PORT:-3001}/api"
echo "❤️  Health Check: http://localhost:${PORT:-3001}/health"
