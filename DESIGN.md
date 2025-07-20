# UK River Levels Monitoring - System Design

## Executive Summary

This document defines the comprehensive system design for a consumer-focused flood monitoring application that addresses UX gaps in existing government solutions through Google-style simplicity and emergency-ready mobile design.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                   │
├─────────────────────────────────────────────────────────────┤
│  App Router    │  Components     │  Hooks        │  State   │
│  - Homepage    │  - SearchBar    │  - useStations│  - Local │
│  - Station     │  - StationCard  │  - useGeo     │  - Cache │
│  - Search      │  - StatusBadge  │  - useWeather │          │
│  - Map         │  - Chart        │               │          │
└─────────────────────────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
        ┌───────────▼────┐   ┌────▼─────────┐
        │ Environment    │   │ OpenWeather  │
        │ Agency API     │   │ API          │
        │ (Flood Data)   │   │ (Weather)    │
        └────────────────┘   └──────────────┘
```

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   └── Navigation
│   └── Footer
│       └── Attribution
├── Pages
│   ├── HomePage
│   │   ├── SearchHero
│   │   │   ├── SearchBar
│   │   │   └── LocationButton
│   │   └── RecentStations
│   ├── SearchPage
│   │   ├── SearchFilters
│   │   ├── StationGrid
│   │   │   └── StationCard[]
│   │   │       ├── StatusBadge
│   │   │       ├── LocationInfo
│   │   │       └── LastUpdated
│   │   └── MapView
│   └── StationPage
│       ├── StationHeader
│       │   ├── StationInfo
│       │   ├── StatusIndicator
│       │   └── WeatherWidget
│       ├── CurrentReadings
│       │   ├── WaterLevelDisplay
│       │   └── FloodRiskIndicator
│       ├── HistoricalChart
│       │   └── TimeSeriesChart
│       └── RelatedStations
└── Shared Components
    ├── LoadingSpinner
    ├── ErrorBoundary
    ├── StatusBadge
    └── Chart
```

## Data Architecture

### Core Data Models

```typescript
// Station Entity - Central data model
interface Station {
  id: string;                    // Environment Agency notation
  label: string;                 // Human-readable name
  riverName: string;             // River context
  town: string;                  // Geographic context
  coordinates: {
    lat: number;
    long: number;
  };
  status: StationStatus;         // Derived from readings
  catchmentName?: string;        // Watershed context
  measures: Measure[];           // Available measurement types
  metadata: StationMetadata;     // Additional context
}

// Reading Entity - Time-series data
interface Reading {
  id: string;
  timestamp: Date;               // ISO 8601 format
  value: number;                 // Measurement value
  unit: string;                  // Units (m, m³/s, etc.)
  parameter: ReadingParameter;   // Type of measurement
  quality: DataQuality;          // Data reliability
  stationId: string;             // Foreign key
}

// Weather Context - Predictive data
interface WeatherData {
  location: Coordinates;
  current: {
    temperature: number;
    humidity: number;
    precipitation: number;       // mm/hour
    conditions: string;
    pressure: number;
  };
  forecast: WeatherForecast[];   // 5-day outlook
  floodRisk: FloodRiskLevel;     // Derived assessment
}
```

### Data Flow Architecture

```
User Input → Search Parameters → API Orchestration → Data Processing → UI State
     │              │                    │                │            │
     │              │                    │                │            └── Component Updates
     │              │                    │                └── Status Calculation
     │              │                    └── Parallel API Calls
     │              └── Geographic/Text Filtering
     └── Location/Query/Station Selection

Caching Layer:
- Station Data: 30 minutes TTL
- Readings: 15 minutes TTL  
- Weather: 10 minutes TTL
- Search Results: 5 minutes TTL
```

## API Design

### Internal API Layer

```typescript
// Unified Data Service
class DataService {
  // Station Operations
  async searchStations(params: SearchParams): Promise<Station[]>
  async getStationDetail(id: string): Promise<StationDetail>
  async getNearbyStations(coords: Coordinates, radius: number): Promise<Station[]>
  
  // Reading Operations
  async getLatestReadings(stationIds?: string[]): Promise<Reading[]>
  async getHistoricalData(stationId: string, period: TimePeriod): Promise<Reading[]>
  
  // Weather Operations
  async getWeatherForStation(stationId: string): Promise<WeatherData>
  async getFloodRiskAssessment(station: Station): Promise<FloodRisk>
  
  // Status Processing
  determineStationStatus(readings: Reading[]): StationStatus
  calculateFloodRisk(weather: WeatherData, readings: Reading[]): FloodRiskLevel
}
```

### External API Integration

```typescript
// Environment Agency API Client
class EnvironmentAgencyClient {
  private readonly baseUrl = 'https://environment.data.gov.uk/flood-monitoring';
  private readonly cache = new Map<string, CacheEntry>();
  
  // Endpoints with optimized parameters
  async getStations(filters: StationFilters): Promise<RawStation[]>
  async getReadings(options: ReadingOptions): Promise<RawReading[]>
  async getStationMeasures(stationId: string): Promise<RawMeasure[]>
  
  // Rate limiting: 4 calls/hour recommended
  // Caching: Aggressive with appropriate TTL
  // Error handling: Exponential backoff + fallback
}

// Weather API Client  
class WeatherClient {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  
  async getCurrentWeather(coords: Coordinates): Promise<RawWeather>
  async getForecast(coords: Coordinates): Promise<RawForecast>
  
  // API key required: NEXT_PUBLIC_WEATHER_API_KEY
  // Rate limits: Standard OpenWeather limits
  // Fallback: Graceful degradation without weather
}
```

## UI Component System

### Design System Specification

```scss
// Color Palette - Water-themed with status indicators
:root {
  // Primary - Water themes
  --color-primary-50: #f0f9ff;    // Lightest blue
  --color-primary-500: #3b82f6;   // Primary blue
  --color-primary-900: #1e3a8a;   // Darkest blue
  
  // Status Colors - Industry standard
  --color-status-normal: #10b981;   // Green - Normal levels
  --color-status-elevated: #f59e0b; // Amber - Elevated levels  
  --color-status-warning: #ef4444;  // Red - Warning levels
  --color-status-severe: #dc2626;   // Dark red - Severe flood risk
  
  // Neutral - Clean, minimal
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}

// Typography - Readable at all sizes
.text-hero { font-size: 2.25rem; font-weight: 700; }
.text-heading { font-size: 1.5rem; font-weight: 600; }
.text-body { font-size: 1rem; line-height: 1.5; }
.text-caption { font-size: 0.875rem; color: var(--color-gray-500); }

// Spacing - Generous white space
.space-xs { padding: 0.5rem; }
.space-sm { padding: 1rem; }
.space-md { padding: 1.5rem; }
.space-lg { padding: 2rem; }
.space-xl { padding: 3rem; }

// Interactive - Touch-friendly
.touch-target { min-height: 44px; min-width: 44px; }
.button-primary { 
  padding: 0.75rem 1.5rem; 
  border-radius: 0.5rem;
  background: var(--color-primary-500);
  color: white;
  font-weight: 600;
}
```

### Core Components

```typescript
// Search Hero - Homepage centerpiece
interface SearchHeroProps {
  onSearch: (query: string) => void;
  onLocationSearch: (coords: Coordinates) => void;
  loading?: boolean;
  placeholder?: string;
}

// Station Card - Grid display item
interface StationCardProps {
  station: Station;
  onClick: (station: Station) => void;
  showDistance?: boolean;
  compact?: boolean;
}

// Status Badge - Universal status display
interface StatusBadgeProps {
  status: StationStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

// Water Level Chart - Historical visualization
interface WaterLevelChartProps {
  readings: Reading[];
  timeRange: TimeRange;
  height?: number;
  thresholds?: LevelThresholds;
}

// Weather Widget - Contextual information
interface WeatherWidgetProps {
  weather: WeatherData;
  compact?: boolean;
  showForecast?: boolean;
}
```

## Mobile-First Responsive Design

### Breakpoint Strategy

```scss
// Mobile-first breakpoints
$breakpoints: (
  'mobile': 0px,        // 320px+ default
  'tablet': 768px,      // iPad and tablets
  'desktop': 1024px,    // Desktop screens
  'wide': 1280px        // Large desktop
);

// Component responsive behavior
.search-hero {
  // Mobile: Full-width, stacked
  padding: 1rem;
  
  @media (min-width: 768px) {
    // Tablet: Centered, max-width
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  @media (min-width: 1024px) {
    // Desktop: Enhanced spacing
    max-width: 800px;
    padding: 3rem;
  }
}

.station-grid {
  // Mobile: Single column
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    // Tablet: Two columns
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    // Desktop: Three columns
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### Performance Optimization

```typescript
// Code splitting strategy
const StationPage = lazy(() => import('./pages/StationPage'));
const MapView = lazy(() => import('./components/MapView'));
const Chart = lazy(() => import('./components/Chart'));

// Image optimization
const StationImage = ({ src, alt }: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={400}
    height={300}
    loading="lazy"
    placeholder="blur"
  />
);

// Service Worker for offline capability
const cacheStrategy = {
  stations: 'cache-first',      // Static data
  readings: 'network-first',    // Real-time data
  weather: 'network-first',     // Current conditions
  assets: 'cache-first'         // CSS, JS, images
};
```

## Emergency Use Design Considerations

### Crisis-Ready Features

```typescript
// Offline-first data strategy
interface OfflineCapability {
  essentialData: {
    nearbyStations: Station[];      // User's local area
    lastKnownReadings: Reading[];   // Most recent data
    emergencyContacts: Contact[];   // Local authorities
  };
  
  fallbackModes: {
    textOnlyMode: boolean;          // Minimal data usage
    offlineMapTiles: boolean;       // Cached map data
    emergencyAlerts: boolean;       // Critical notifications
  };
}

// Accessibility requirements
const a11yRequirements = {
  contrast: 'AAA',                  // High contrast for outdoor use
  fontSize: 'min-16px',             // Readable on small screens
  touchTargets: 'min-44px',         // Easy to tap in stress
  voiceNavigation: true,            // Hands-free operation
  screenReader: 'WCAG-2.1-AA'       // Full accessibility
};

// Progressive enhancement
const emergencyFeatures = {
  quickActions: [
    'Find nearest station',
    'Check flood warnings', 
    'Get emergency contacts',
    'Share location'
  ],
  
  dataEfficiency: {
    compressedImages: true,
    minimalJS: true,
    criticalCSS: true,
    prefetchStrategy: 'conservative'
  }
};
```

## State Management Architecture

### Local State Strategy

```typescript
// Page-level state management
interface AppState {
  // Search state
  search: {
    query: string;
    results: Station[];
    loading: boolean;
    error: string | null;
    filters: SearchFilters;
  };
  
  // Location state
  location: {
    current: Coordinates | null;
    permission: GeolocationPermission;
    accuracy: number;
    lastUpdated: Date;
  };
  
  // User preferences
  preferences: {
    units: 'metric' | 'imperial';
    theme: 'light' | 'dark' | 'auto';
    notifications: NotificationSettings;
    recentStations: string[];
  };
  
  // Cache state
  cache: {
    stations: Map<string, CacheEntry<Station>>;
    readings: Map<string, CacheEntry<Reading[]>>;
    weather: Map<string, CacheEntry<WeatherData>>;
  };
}

// Context providers for shared state
const SearchContext = createContext<SearchState>();
const LocationContext = createContext<LocationState>();
const PreferencesContext = createContext<PreferencesState>();
```

### Caching Strategy

```typescript
// Multi-level caching system
class CacheManager {
  private memoryCache = new Map();
  private localStorage = window.localStorage;
  private sessionStorage = window.sessionStorage;
  
  // Cache hierarchy: Memory → Session → Local → Network
  async get<T>(key: string): Promise<T | null> {
    // 1. Check memory cache (fastest)
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (this.isValid(entry)) return entry.data;
    }
    
    // 2. Check session storage (page session)
    const sessionData = this.getFromSession<T>(key);
    if (sessionData) {
      this.memoryCache.set(key, sessionData);
      return sessionData.data;
    }
    
    // 3. Check local storage (persistent)
    const localData = this.getFromLocal<T>(key);
    if (localData) {
      this.sessionStorage.setItem(key, JSON.stringify(localData));
      this.memoryCache.set(key, localData);
      return localData.data;
    }
    
    // 4. Fetch from network (last resort)
    return null;
  }
  
  set<T>(key: string, data: T, ttl: number): void {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    this.memoryCache.set(key, entry);
    
    // Persist based on data type
    if (this.isPersistent(key)) {
      this.localStorage.setItem(key, JSON.stringify(entry));
    } else {
      this.sessionStorage.setItem(key, JSON.stringify(entry));
    }
  }
}
```

## Error Handling & Resilience

### Error Boundary Strategy

```typescript
// Application-wide error handling
class AppErrorBoundary extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to monitoring service
    console.error('Application Error:', error, errorInfo);
    
    // Report to analytics
    this.reportError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <FallbackComponent 
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    
    return this.props.children;
  }
}

// API error handling with retry logic
class APIErrorHandler {
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    backoffMs: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) break;
        
        // Exponential backoff
        const delay = backoffMs * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }
    
    throw new APIError(
      `Operation failed after ${maxRetries + 1} attempts`,
      lastError
    );
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Security & Privacy

### Data Protection

```typescript
// Privacy-first data handling
const privacyPolicy = {
  dataCollection: {
    location: 'user-consent-required',
    usage: 'anonymous-analytics-only',
    retention: '30-days-maximum',
    sharing: 'never-with-third-parties'
  },
  
  security: {
    https: 'enforced',
    apiKeys: 'environment-variables-only',
    userInput: 'sanitized-and-validated',
    errorLogging: 'no-personal-data'
  },
  
  transparency: {
    dataUsage: 'clearly-documented',
    attribution: 'environment-agency-required',
    openSource: 'design-and-approach'
  }
};

// Input validation and sanitization
class InputValidator {
  static sanitizeSearchQuery(query: string): string {
    return query
      .trim()
      .replace(/[<>\"'&]/g, '') // Remove HTML/SQL injection chars
      .substring(0, 100); // Limit length
  }
  
  static validateCoordinates(lat: number, lng: number): boolean {
    return (
      lat >= 49 && lat <= 61 &&    // UK latitude bounds
      lng >= -8 && lng <= 2 &&     // UK longitude bounds
      !isNaN(lat) && !isNaN(lng)   // Valid numbers
    );
  }
  
  static validateStationId(id: string): boolean {
    return /^[a-zA-Z0-9-_]+$/.test(id) && id.length <= 50;
  }
}
```

This comprehensive system design provides the foundation for building a consumer-focused, emergency-ready flood monitoring application that addresses the identified market gaps while maintaining technical excellence and user privacy.