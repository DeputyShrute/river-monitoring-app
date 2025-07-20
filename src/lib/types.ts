// Core data types for the application

export interface Station {
  id: string;
  label: string;
  riverName: string;
  town: string;
  lat: number;
  long: number;
  status: StationStatus;
  catchmentName?: string;
  measures?: Measure[];
}

export interface StationDetail extends Station {
  description?: string;
  normalRange?: [number, number];
  warningThreshold?: number;
  easting?: number;
  northing?: number;
  gridReference?: string;
}

export interface Reading {
  id: string;
  timestamp: string;
  value: number;
  unit: string;
  parameter: ReadingParameter;
  qualifier?: string;
  quality?: DataQuality;
  stationId: string;
}

export interface Measure {
  id: string;
  parameter: ReadingParameter;
  unit: string;
  unitName: string;
  qualifier?: string;
  station: string;
  latestReading?: Reading;
}

export type StationStatus = 'normal' | 'elevated' | 'warning' | 'severe' | 'unknown';
export type ReadingParameter = 'level' | 'flow' | 'temperature' | 'rainfall';
export type DataQuality = 'good' | 'poor' | 'missing' | 'estimated';

// Search and filtering
export interface SearchParams {
  query?: string;
  lat?: number;
  long?: number;
  distance?: number; // km radius
  riverName?: string;
  parameter?: ReadingParameter;
  town?: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

// Weather integration
export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  conditions: string;
  description: string;
  windSpeed: number;
  pressure: number;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  precipitation: number;
  conditions: string;
  icon: string;
}

// API responses
export interface ApiResponse<T> {
  items: T[];
  meta?: {
    publisher: string;
    licence: string;
    documentation: string;
    version: string;
    comment: string;
  };
}

export interface ApiError {
  type: 'network' | 'server' | 'data_quality' | 'rate_limit' | 'not_found';
  message: string;
  retryAfter?: number;
  statusCode?: number;
}

// UI state management
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface SearchState extends LoadingState {
  results: Station[];
  query: string;
  location: LocationData | null;
}

export interface StationState extends LoadingState {
  station: StationDetail | null;
  readings: Reading[];
  weather: WeatherData | null;
}