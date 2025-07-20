import {
  Station,
  StationDetail,
  Reading,
  SearchParams,
  ReadingParameter
} from '../types';
import { buildUrl, handleApiError, stationsCache, readingsCache } from '../utils';

const API_BASE = 'https://environment.data.gov.uk/flood-monitoring';

// API Response types for Environment Agency
interface RawStation {
  notation: string;
  label: string;
  riverName?: string;
  town?: string;
  lat: number;
  long: number;
  catchmentName?: string;
  easting?: number;
  northing?: number;
  gridReference?: string;
  measures?: RawMeasure[];
}

interface RawMeasure {
  '@id': string;
  parameter: string;
  unit: string;
  unitName: string;
  qualifier?: string;
  station: string;
}

interface RawReadingResponse {
  '@id': string;
  dateTime: string;
  value: number;
  measure?: {
    unit?: string;
    parameter?: string;
    qualifier?: string;
    station?: {
      notation?: string;
    };
  };
}

// Core API client
class EnvironmentAgencyAPI {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'UK-River-Levels-App/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get stations with filtering
  async getStations(params: SearchParams = {}): Promise<Station[]> {
    const cacheKey = JSON.stringify(params);
    const cached = stationsCache.get(cacheKey);
    if (cached) return cached;

    const url = buildUrl(`${API_BASE}/id/stations`, {
      lat: params.lat,
      long: params.long,
      dist: params.distance,
      riverName: params.riverName,
      parameter: params.parameter,
      town: params.town,
      _limit: 50 // Reasonable limit for UI
    });

    const response = await this.fetchWithErrorHandling<{ items: RawStation[] }>(url);
    
    const stations: Station[] = response.items.map(item => ({
      id: item.notation,
      label: item.label,
      riverName: item.riverName || 'Unknown River',
      town: item.town || 'Unknown',
      lat: item.lat,
      long: item.long,
      status: 'unknown', // Will be updated with readings
      catchmentName: item.catchmentName,
      measures: item.measures?.map((measure: RawMeasure) => ({
        id: measure['@id'],
        parameter: measure.parameter as ReadingParameter,
        unit: measure.unit,
        unitName: measure.unitName,
        qualifier: measure.qualifier,
        station: measure.station
      }))
    }));

    stationsCache.set(cacheKey, stations, 30 * 60 * 1000); // 30 minutes
    return stations;
  }

  // Get station details
  async getStationDetail(stationId: string): Promise<StationDetail> {
    const url = `${API_BASE}/id/stations/${stationId}`;
    const response = await this.fetchWithErrorHandling<{ items: RawStation[] }>(url);
    
    const item = response.items[0];
    if (!item) {
      throw new Error('Station not found');
    }

    return {
      id: item.notation,
      label: item.label,
      riverName: item.riverName || 'Unknown River',
      town: item.town || 'Unknown',
      lat: item.lat,
      long: item.long,
      status: 'unknown',
      catchmentName: item.catchmentName,
      description: item.label,
      easting: item.easting,
      northing: item.northing,
      gridReference: item.gridReference,
      measures: item.measures?.map((measure: RawMeasure) => ({
        id: measure['@id'],
        parameter: measure.parameter as ReadingParameter,
        unit: measure.unit,
        unitName: measure.unitName,
        qualifier: measure.qualifier,
        station: measure.station
      }))
    };
  }

  // Get latest readings for all stations
  async getLatestReadings(): Promise<Reading[]> {
    const cacheKey = 'latest-readings';
    const cached = readingsCache.get(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/data/readings?latest&_limit=1000`;
    const response = await this.fetchWithErrorHandling<{ items: RawReadingResponse[] }>(url);
    
    const readings: Reading[] = response.items.map(item => ({
      id: item['@id'],
      timestamp: item.dateTime,
      value: item.value,
      unit: item.measure?.unit || 'm',
      parameter: (item.measure?.parameter || 'level') as ReadingParameter,
      qualifier: item.measure?.qualifier,
      quality: 'good', // Default assumption
      stationId: item.measure?.station?.notation || ''
    }));

    readingsCache.set(cacheKey, readings, 15 * 60 * 1000); // 15 minutes
    return readings;
  }

  // Get readings for specific station
  async getStationReadings(
    stationId: string,
    options: { since?: string; until?: string; limit?: number } = {}
  ): Promise<Reading[]> {
    const cacheKey = `${stationId}-${JSON.stringify(options)}`;
    const cached = readingsCache.get(cacheKey);
    if (cached) return cached;

    const url = buildUrl(`${API_BASE}/id/stations/${stationId}/readings`, {
      since: options.since,
      until: options.until,
      _limit: options.limit || 100,
      _sorted: true
    });

    const response = await this.fetchWithErrorHandling<{ items: RawReadingResponse[] }>(url);
    
    const readings: Reading[] = response.items.map(item => ({
      id: item['@id'],
      timestamp: item.dateTime,
      value: item.value,
      unit: item.measure?.unit || 'm',
      parameter: (item.measure?.parameter || 'level') as ReadingParameter,
      qualifier: item.measure?.qualifier,
      quality: 'good',
      stationId: stationId
    }));

    readingsCache.set(cacheKey, readings, 15 * 60 * 1000); // 15 minutes
    return readings;
  }

  // Search stations by location name
  async searchStationsByName(query: string): Promise<Station[]> {
    return this.getStations({
      query: query
    });
  }

  // Get stations near coordinates
  async getStationsNearLocation(
    lat: number,
    lng: number,
    radiusKm: number = 10
  ): Promise<Station[]> {
    return this.getStations({
      lat,
      long: lng,
      distance: radiusKm
    });
  }

  // Get historical readings for time period
  async getHistoricalReadings(
    stationId: string,
    days: number = 7
  ): Promise<Reading[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return this.getStationReadings(stationId, {
      since: since.toISOString(),
      limit: days * 96 // 15-min intervals
    });
  }
}

// Export singleton instance
export const environmentAPI = new EnvironmentAgencyAPI();

// Convenience functions
export async function searchStations(params: SearchParams): Promise<Station[]> {
  return environmentAPI.getStations(params);
}

export async function getStationDetails(stationId: string): Promise<StationDetail> {
  return environmentAPI.getStationDetail(stationId);
}

export async function getLatestReadings(): Promise<Reading[]> {
  return environmentAPI.getLatestReadings();
}

export async function getStationReadings(
  stationId: string,
  options?: { since?: string; until?: string; limit?: number }
): Promise<Reading[]> {
  return environmentAPI.getStationReadings(stationId, options);
}

export async function searchNearLocation(
  lat: number,
  lng: number,
  radiusKm?: number
): Promise<Station[]> {
  return environmentAPI.getStationsNearLocation(lat, lng, radiusKm);
}