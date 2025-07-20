import { useState, useEffect } from 'react';
import { Station, Reading, SearchParams, StationStatus } from '@/lib/types';
import { searchStations, getLatestReadings } from '@/lib/api/environment-agency';
import { determineStationStatus } from '@/lib/utils';

interface UseStationsResult {
  stations: Station[];
  loading: boolean;
  error: string | null;
  search: (params: SearchParams) => Promise<void>;
  refreshReadings: () => Promise<void>;
}

export function useStations(): UseStationsResult {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const stationResults = await searchStations(params);
      
      // Get latest readings to determine status
      const readings = await getLatestReadings();
      
      // Map readings to stations
      const readingsMap = new Map<string, Reading[]>();
      readings.forEach(reading => {
        if (!readingsMap.has(reading.stationId)) {
          readingsMap.set(reading.stationId, []);
        }
        readingsMap.get(reading.stationId)!.push(reading);
      });

      // Update stations with status
      const stationsWithStatus = stationResults.map(station => ({
        ...station,
        status: determineStationStatus(readingsMap.get(station.id) || [])
      }));

      setStations(stationsWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stations');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshReadings = async () => {
    if (stations.length === 0) return;

    try {
      const readings = await getLatestReadings();
      
      // Update station statuses
      const readingsMap = new Map<string, Reading[]>();
      readings.forEach(reading => {
        if (!readingsMap.has(reading.stationId)) {
          readingsMap.set(reading.stationId, []);
        }
        readingsMap.get(reading.stationId)!.push(reading);
      });

      setStations(prevStations =>
        prevStations.map(station => ({
          ...station,
          status: determineStationStatus(readingsMap.get(station.id) || [])
        }))
      );
    } catch (err) {
      console.warn('Failed to refresh readings:', err);
    }
  };

  return {
    stations,
    loading,
    error,
    search,
    refreshReadings
  };
}