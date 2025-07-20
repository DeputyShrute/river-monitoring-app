'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, MapPin, Clock, Search } from 'lucide-react'
import SearchHero from '@/components/SearchHero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import { useStations } from '@/hooks/useStations'
import { useGeolocation } from '@/hooks/useGeolocation'
import type { Station, SearchParams } from '@/lib/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { stations, loading, error, search } = useStations()
  const { location } = useGeolocation()
  const [searchPerformed, setSearchPerformed] = useState(false)
  
  const handleSearch = useCallback(async (query: string) => {
    const searchRequest: SearchParams = {
      query: query
    }
    
    await search(searchRequest)
    setSearchPerformed(true)
  }, [search])

  const handleLocationSearch = useCallback(async (lat: number, lng: number) => {
    const searchRequest: SearchParams = {
      lat,
      long: lng,
      distance: 10 // 10km radius
    }
    
    await search(searchRequest)
    setSearchPerformed(true)
  }, [search])

  // Get initial query from URL params
  const initialQuery = searchParams.get('q') || ''
  const initialLat = searchParams.get('lat')
  const initialLng = searchParams.get('lng')

  // Perform search when component mounts with query parameter
  useEffect(() => {
    if (initialQuery && !searchPerformed) {
      handleSearch(initialQuery)
      setSearchPerformed(true)
    } else if (initialLat && initialLng && !searchPerformed) {
      handleLocationSearch(parseFloat(initialLat), parseFloat(initialLng))
      setSearchPerformed(true)
    }
  }, [initialQuery, initialLat, initialLng, searchPerformed, handleSearch, handleLocationSearch])

  const handleStationClick = (station: Station) => {
    // Store in recent stations (localStorage)
    const recentStations = JSON.parse(localStorage.getItem('recentStations') || '[]')
    const updatedRecent = [
      station,
      ...recentStations.filter((s: Station) => s.id !== station.id)
    ].slice(0, 5) // Keep only 5 recent stations
    
    localStorage.setItem('recentStations', JSON.stringify(updatedRecent))
    
    // Navigate to station detail (placeholder for now)
    console.log('Navigate to station:', station.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Search Section */}
      <section 
        className="pt-8 pb-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="search-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h1 id="search-heading" className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Search River Monitoring Stations
          </h1>
          
          <SearchHero 
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
          />
        </div>
      </section>

      {/* Results Section */}
      <section 
        className="pb-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="results-heading"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-lg text-gray-700">Searching stations...</span>
              </div>
            </div>
          )}

          {error && (
            <div 
              className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
              role="alert"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {searchPerformed && !loading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 id="results-heading" className="text-2xl font-bold text-gray-900">
                  {stations.length > 0 
                    ? `Found ${stations.length} monitoring station${stations.length === 1 ? '' : 's'}`
                    : 'No stations found'
                  }
                </h2>
                
                {location && (
                  <div className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
                    Near your location
                  </div>
                )}
              </div>

              {stations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try searching for a different location, river name, or expanding your search area.
                  </p>
                  <div className="space-y-3 text-sm text-gray-500">
                    <p><strong>Try searching for:</strong></p>
                    <ul className="space-y-1">
                      <li>• River names (e.g., &ldquo;Thames&rdquo;, &ldquo;Severn&rdquo;)</li>
                      <li>• Town names (e.g., &ldquo;Oxford&rdquo;, &ldquo;Worcester&rdquo;)</li>
                      <li>• Catchment areas (e.g., &ldquo;Yorkshire Dales&rdquo;)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stations.map((station) => (
                    <Card 
                      key={station.id}
                      variant="interactive"
                      className="h-full group"
                    >
                      <button
                        className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                        onClick={() => handleStationClick(station)}
                        aria-label={`View details for ${station.label}. Status: ${station.status}. Located in ${station.town} on ${station.riverName}.`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {station.label}
                              </CardTitle>
                              <p className="text-sm text-gray-600 mt-1">
                                {station.riverName} • {station.town}
                              </p>
                            </div>
                            <StatusBadge 
                              status={station.status} 
                              size="sm"
                              showText={false}
                            />
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          {/* Catchment Info */}
                          {station.catchmentName && (
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
                              <span className="truncate">
                                {station.catchmentName} catchment
                              </span>
                            </div>
                          )}

                          {/* Status */}
                          <div className="flex items-center justify-between mb-4">
                            <StatusBadge 
                              status={station.status} 
                              size="sm"
                            />
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                              Live data
                            </div>
                          </div>

                          {/* Available Measures */}
                          {station.measures && station.measures.length > 0 && (
                            <div className="pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500 mb-2">Available measurements:</div>
                              <div className="flex flex-wrap gap-1">
                                {station.measures.slice(0, 3).map((measure, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {measure.parameter}
                                  </span>
                                ))}
                                {station.measures.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    +{station.measures.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </button>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {!searchPerformed && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Search</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter a location, river name, or use your current location to find nearby monitoring stations.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}