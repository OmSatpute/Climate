@echo off
echo 🚀 Setting up Carbon Risk Tracker Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit .env file with your database credentials before continuing.
    echo    You can run this script again after updating .env
    exit /b 0
)

REM Run migrations
echo 🔄 Running database migrations...
npm run db:migrate

REM Seed database
echo 🌱 Seeding database with regions data...
npm run db:seed

REM Create uploads directory
echo 📁 Creating uploads directory...
if not exist uploads mkdir uploads

echo ✅ Setup complete!
echo.
echo 🎉 You can now start the development server with:
echo    npm run dev
echo.
echo 📊 API will be available at: http://localhost:3001
echo 📖 API Documentation: http://localhost:3001/api
echo ❤️  Health Check: http://localhost:3001/health

pause
