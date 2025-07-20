# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UK River Levels Monitoring is a **consumer-focused flood monitoring tool** that addresses significant UX gaps in existing government flood monitoring websites. The project aims to create a **Google-style, minimal interface** that prioritizes user experience over comprehensive data display.

### Vision & Market Problem
Current UK flood monitoring sites (Environment Agency's check-for-flooding.service.gov.uk, RiverLevels.UK) suffer from:
- **Cluttered interfaces** with excessive information density
- **Poor mobile responsiveness** limiting emergency access
- **Outdated visual design** feeling institutional rather than user-friendly
- **Complex navigation** obscuring core functionality
- **Lack of contextual information** like weather integration

### Core Value Proposition
Transform from a simple monitoring tool to a **predictive flood awareness system** that helps users make informed decisions about flood risk to their properties. Emergency-focused design recognizing that flood monitoring is often needed during crises when users rely on mobile devices.

## Core Commands

### Development
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Setup
Required environment variables in `.env.local`:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Data Sources**: Environment Agency Flood Monitoring API, OpenWeatherMap API

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components  
├── hooks/               # Custom React hooks
└── lib/
    ├── api/            # External API integrations
    ├── types.ts        # TypeScript type definitions
    └── utils.ts        # Utility functions and caching
```

### Key Components

**API Layer (`src/lib/api/`)**:
- `environment-agency.ts`: Core Environment Agency API client with caching
- `weather.ts`: OpenWeatherMap integration for weather context

**Type System (`src/lib/types.ts`)**:
- Comprehensive TypeScript interfaces for all data structures
- Station, Reading, Weather, and API response types
- Status enums and search parameter types

**Custom Hooks (`src/hooks/`)**:
- `useStations.ts`: Station search and reading management
- `useGeolocation.ts`: Browser geolocation integration

**Utilities (`src/lib/utils.ts`)**:
- Status determination logic from water level readings
- Caching system with TTL (Time To Live)
- Distance calculations and formatting functions
- Error handling and API utilities

### Design Principles

**Google-Style Simplicity**:
- **Single-purpose homepage** with prominent search functionality
- **Card-based layouts** for clean information hierarchy
- **Generous white space** to prevent visual overwhelm
- **Limited color palette** focused on water themes (blues, teals)
- **Industry-standard status colors**: Green (normal), Amber (elevated), Red (warning)

**Mobile-First Emergency Design**:
- **Touch-friendly interactions** with appropriately sized buttons
- **Fast loading times** optimized for mobile networks during emergencies
- **Clear navigation** with intuitive back/forward flows
- **Readable typography** at all screen sizes
- **Offline-capable** Progressive Web App functionality

**Data Flow**:
1. Search parameters → Environment Agency API
2. Station data + latest readings → Status determination
3. Weather API integration for flood risk context
4. Caching layer for performance optimization

**Status Classification**:
- Normal: < 2.0m water level (Green)
- Elevated: 2.0-3.0m (Amber)
- Warning: 3.0-4.0m (Red)
- Severe: > 4.0m (Red with alert)
- Unknown: No data or non-level readings

**Performance Features**:
- Sub-2 second page load times
- Intelligent caching (15-30 minute TTL)
- API response limiting and pagination
- Error boundary implementation
- Core Web Vitals optimization

### Environment Agency API Integration

**Base URL**: `https://environment.data.gov.uk/flood-monitoring`

**Core Endpoints**:

1. **Stations** (`/id/stations`)
   - Discovery and metadata for monitoring stations
   - Filters: `parameter`, `lat`, `long`, `dist`, `riverName`, `town`, `status`
   - Returns: Station metadata, measures, geographic location
   - Example: `/id/stations?lat=53.7&long=-1.5&dist=10`

2. **Readings** (`/data/readings`)
   - Time-series measurement data
   - Station-specific: `/id/stations/{id}/readings`
   - Time filters: `latest`, `today`, `since`, `startdate`/`enddate`
   - Measurement filters: `parameter`, `qualifier`, `stationReference`
   - Example: `/data/readings?latest&parameter=level`

3. **Measures** (`/id/measures`)
   - Measurement type definitions and metadata
   - Same filtering options as stations
   - Links measurements to stations

4. **Flood Warnings** (`/id/floods`)
   - Current flood alerts and warnings
   - Filters: `min-severity`, `county`, geographic location
   - Severity levels: 1-4 (Severe Flood Warning to Flood Alert)

**API Characteristics**:
- **Authentication**: None required (open data)
- **Rate Limits**: Recommended 4 calls per hour for production
- **Data Updates**: Every 15 minutes for readings
- **Response Formats**: JSON (primary), RDF, CSV, HTML
- **Service Level**: Beta service, no SLA guarantees
- **Caching**: Use `latest` parameter for efficiency
- **Attribution Required**: "Environment Agency flood and river level data from the real-time data API (Beta)"

**Geographic Filtering**:
- `lat`, `long`: Decimal degrees (WGS84)
- `dist`: Distance in kilometers from coordinates
- UK Coordinate bounds: lat 49-61, long -8 to 2

**Time Handling**:
- ISO 8601 format (e.g., `2024-01-15T10:30:00Z`)
- `since`: Readings after specified datetime
- Historical data: Up to 4 weeks available

**Response Structure**:
```json
{
  "@context": "...",
  "meta": {
    "publisher": "Environment Agency",
    "licence": "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    "documentation": "...",
    "version": "...",
    "comment": "..."
  },
  "items": [ /* Array of data objects */ ]
}
```

**Error Handling**:
- HTTP status codes: 200 (OK), 404 (Not Found), 500 (Server Error)
- No specific rate limit errors documented
- Service may redirect during high load

**Implementation Notes**:
- Follow HTTP redirects
- Handle potential API version changes
- Monitor for service announcements
- Cache responses with appropriate TTL
- Implement exponential backoff for retries

**Weather Integration**:
- Current conditions at station locations via OpenWeatherMap
- Precipitation forecasts for flood risk assessment
- Graceful fallback when weather data unavailable

### Path Aliases
Configure imports using these aliases defined in `tsconfig.json`:
```typescript
import { Station } from '@/lib/types';
import { useStations } from '@/hooks/useStations';
import MyComponent from '@/components/MyComponent';
```

## Development Notes

### Code Conventions
- Use TypeScript strict mode throughout
- Implement proper error boundaries for API failures
- Follow mobile-first responsive design patterns
- Maintain consistent status color coding (green/amber/red)
- Cache API responses appropriately (15-30 minutes for live data)

### Success Metrics & Performance Targets

**Technical Performance**:
- Page load times under 2 seconds
- API response times averaging under 500ms
- Core Web Vitals scores in green range
- Mobile responsiveness across all major devices
- Progressive Web App capabilities

**User Experience Goals**:
- Search success rate above 90%
- Clear visual status indication for all river levels
- Intuitive navigation between related stations
- Clean, uncluttered interface **free from advertisements**
- Emergency-ready mobile experience

### Development Approach

**Incremental Development Strategy**:
1. **Phase 1**: Homepage with Google-style search interface
2. **Phase 2**: Location search and Environment Agency API integration
3. **Phase 3**: Station details with charts and weather integration
4. **Phase 4**: Performance optimization and production deployment

**Key Implementation Focus**:
- TypeScript integration for robust API data handling
- Component-based architecture for code reuse
- Responsive design testing at each development stage
- Error boundary implementation for graceful failure handling
- Weather integration as predictive flood awareness enhancement

### Data Quality & Attribution
- Handle missing or poor quality readings gracefully
- Validate coordinates and API responses
- Implement retry logic with exponential backoff
- Provide meaningful error messages to users
- **Required Attribution**: "Environment Agency flood and river level data from the real-time data API (Beta)"