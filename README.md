# UK River Levels Monitoring

A clean, modern web application for monitoring UK river levels and flood warnings using the Environment Agency API.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Features

- **Clean Interface**: Google-style minimal design
- **Real-time Data**: Live river level monitoring
- **Mobile-First**: Responsive design for all devices
- **Weather Integration**: Contextual weather information
- **Fast Performance**: Sub-2 second load times
- **Offline Support**: Progressive Web App capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 14 + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Deployment**: Vercel

## 📊 Data Sources

- **River Data**: Environment Agency Flood Monitoring API
- **Weather**: OpenWeatherMap API
- **Geolocation**: Browser Geolocation API

## 🏗 Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── lib/                 # Utilities & API integration
└── hooks/               # Custom React hooks
```

## 🌍 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Attribution

This application uses Environment Agency flood and river level data from the real-time data API (Beta). Not intended for safety-critical applications.

## 📚 Documentation

- **[Development Guide](CLAUDE.md)** - Comprehensive development setup and conventions
- **[System Design](DESIGN.md)** - Architecture and component specifications  
- **[Implementation Plan](IMPLEMENTATION_WORKFLOW.md)** - 8-week development roadmap
- **[Git Workflow](BRANCHING_STRATEGY.md)** - Branching strategy and release process
- **[CI/CD Pipeline](CI_CD.md)** - Quality gates and automated deployment process
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## 📄 License

MIT License - see LICENSE file for details.