import { StationStatus, Reading, Station } from './types';

// Status determination based on readings
export function determineStationStatus(readings: Reading[]): StationStatus {
  if (!readings || readings.length === 0) return 'unknown';
  
  const latestReading = readings[0];
  if (!latestReading || latestReading.parameter !== 'level') return 'unknown';
  
  const level = latestReading.value;
  
  // These thresholds would ideally come from station metadata
  // For now, using general guidelines
  if (level > 4.0) return 'severe';
  if (level > 3.0) return 'warning';
  if (level > 2.0) return 'elevated';
  return 'normal';
}

// Distance calculation between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

// Format timestamp for display
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format water level for display
export function formatWaterLevel(value: number, unit: string = 'm'): string {
  return `${value.toFixed(2)}${unit}`;
}

// Get status color classes
export function getStatusColor(status: StationStatus): string {
  const colors = {
    normal: 'text-status-normal bg-status-normal/10 border-status-normal/20',
    elevated: 'text-status-elevated bg-status-elevated/10 border-status-elevated/20',
    warning: 'text-status-warning bg-status-warning/10 border-status-warning/20',
    severe: 'text-status-severe bg-status-severe/10 border-status-severe/20',
    unknown: 'text-gray-500 bg-gray-100 border-gray-200'
  };
  
  return colors[status] || colors.unknown;
}

// Get status emoji
export function getStatusEmoji(status: StationStatus): string {
  const emojis = {
    normal: '🟢',
    elevated: '🟡',
    warning: '🔴',
    severe: '🚨',
    unknown: '⚫'
  };
  
  return emojis[status] || emojis.unknown;
}

// Validate coordinates
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
}

// Simple cache implementation
export class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();
  
  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Create cache instances
export const stationsCache = new SimpleCache<Station[]>();
export const readingsCache = new SimpleCache<Reading[]>();
export const weatherCache = new SimpleCache<any>();

// Error handling utilities
export function handleApiError(error: any): string {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  if (error.status === 404) {
    return 'Station not found.';
  }
  
  if (error.status === 429) {
    return 'Too many requests. Please try again later.';
  }
  
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
}

// URL utilities
export function buildUrl(base: string, params: Record<string, any>): string {
  const url = new URL(base);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.toString();
}