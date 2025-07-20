import { WeatherData, WeatherForecast } from '../types';
import { weatherCache, handleApiError } from '../utils';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

class WeatherAPI {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get current weather for coordinates
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key not configured');
    }

    const cacheKey = `weather-${lat}-${lng}`;
    const cached = weatherCache.get(cacheKey);
    if (cached) return cached;

    const url = `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const data = await this.fetchWithErrorHandling<any>(url);
    
    const weather: WeatherData = {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      precipitation: data.rain?.['1h'] || 0,
      conditions: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      icon: data.weather[0].icon
    };

    weatherCache.set(cacheKey, weather, 10 * 60 * 1000); // 10 minutes
    return weather;
  }

  // Get weather forecast
  async getForecast(lat: number, lng: number): Promise<WeatherForecast[]> {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key not configured');
    }

    const cacheKey = `forecast-${lat}-${lng}`;
    const cached = weatherCache.get(cacheKey);
    if (cached) return cached;

    const url = `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const data = await this.fetchWithErrorHandling<any>(url);
    
    const forecast: WeatherForecast[] = data.list.slice(0, 5).map((item: any) => ({
      date: item.dt_txt,
      temperature: {
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max)
      },
      precipitation: item.rain?.['3h'] || 0,
      conditions: item.weather[0].main,
      icon: item.weather[0].icon
    }));

    weatherCache.set(cacheKey, forecast, 30 * 60 * 1000); // 30 minutes
    return forecast;
  }

  // Check if weather indicates flood risk
  isFloodRisk(weather: WeatherData): boolean {
    return (
      weather.precipitation > 5 || // Heavy rain
      weather.conditions.toLowerCase().includes('rain') ||
      weather.conditions.toLowerCase().includes('storm')
    );
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPI();

// Convenience functions
export async function getWeatherForLocation(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    return await weatherAPI.getCurrentWeather(lat, lng);
  } catch (error) {
    console.warn('Weather data unavailable:', error);
    return null;
  }
}

export async function getForecastForLocation(lat: number, lng: number): Promise<WeatherForecast[]> {
  try {
    return await weatherAPI.getForecast(lat, lng);
  } catch (error) {
    console.warn('Weather forecast unavailable:', error);
    return [];
  }
}

export function isFloodRisk(weather: WeatherData): boolean {
  return weatherAPI.isFloodRisk(weather);
}