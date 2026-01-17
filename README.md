# Carbon → Humanitarian Risk Tracker

A modern web application that connects personal carbon emissions to their humanitarian impact on vulnerable communities worldwide.

## Features

- **Carbon Footprint Tracking**: Monitor emissions across transport, energy, food, and shopping
- **Humanitarian Risk Visualization**: See how your emissions affect vulnerable communities
- **Interactive Global Map**: Explore risk regions with real-time data
- **CSV Data Import**: Upload your activity data for automated analysis
- **Personalized Recommendations**: Get actionable insights to reduce your impact
- **Demo Mode**: Explore with sample data without registration

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet for interactive mapping
- **Routing**: React Router v6
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd carbon-risk-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Building for Production

To create a production-ready static website:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder that can be deployed to any static hosting service.

### Preview Production Build

Test your production build locally:

```bash
npm run preview
```

### Deployment

The `dist/` folder contains everything needed for deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── SummaryCard.tsx  # Metric display cards
│   ├── RiskCard.tsx     # Risk assessment cards
│   ├── InteractiveMap.tsx # Leaflet map component
│   ├── TimelineChart.tsx # Trend visualization
│   └── RecommendationsList.tsx # Action suggestions
├── pages/               # Application pages
│   ├── Landing.tsx      # Home page
│   ├── Login.tsx        # Authentication
│   ├── Signup.tsx       # User registration
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Regions.tsx      # Global risk map
│   ├── Import.tsx       # Data upload
│   └── Demo.tsx         # Demo experience
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

## API Integration

The app is designed to connect to a backend API at `http://localhost:4000/api`. Key endpoints:

- `GET /api/footprints/summary` - Carbon footprint data
- `POST /api/footprints/import` - CSV data upload
- `POST /api/risk/evaluate` - Risk assessment
- `GET /api/regions` - Global risk regions

## Demo Mode

Visit `/demo` to explore the application with sample data without creating an account.

## Disclaimer

⚠️ **Important**: Humanitarian risk projections are simplified demo estimates for illustration purposes and should not be used for actual risk assessment or decision-making.

## License

This project is built for demonstration purposes. Please ensure compliance with relevant data protection and humanitarian guidelines when using real data.