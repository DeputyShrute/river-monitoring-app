'use client'

import React, { useState, useCallback } from 'react'
import { Search, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useGeolocation } from '@/hooks/useGeolocation'

interface SearchHeroProps {
  onSearch?: (query: string) => void
  onLocationSearch?: (lat: number, lng: number) => void
}

export default function SearchHero({ onSearch, onLocationSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  const { 
    location, 
    loading: locationLoading, 
    error: locationError, 
    requestLocation 
  } = useGeolocation()

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      onSearch?.(searchQuery.trim())
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, onSearch])

  const handleLocationSearch = useCallback(() => {
    requestLocation()
  }, [requestLocation])

  // Effect to trigger location search when location is obtained
  React.useEffect(() => {
    if (location && !locationError) {
      onLocationSearch?.(location.lat, location.lng)
    }
  }, [location, locationError, onLocationSearch])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for river, town, or station name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
            className="text-lg py-4 pr-32"
            aria-label="Search for flood monitoring stations"
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              loading={isSearching}
              className="h-10"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </form>

      {/* Location Search */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">or</p>
        
        <Button
          variant="secondary"
          onClick={handleLocationSearch}
          disabled={locationLoading}
          loading={locationLoading}
          className="mx-auto"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {locationLoading ? 'Getting location...' : 'Find stations near me'}
        </Button>

        {/* Location Status */}
        {location && (
          <p className="mt-3 text-sm text-green-600">
            ✓ Location found: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}

        {locationError && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Location access needed:</strong> {locationError}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              You can still search by entering a town or river name above.
            </p>
          </div>
        )}
      </div>

      {/* Quick Search Examples */}
      <div className="mt-8 text-center">
        <p id="search-examples-label" className="text-sm text-gray-500 mb-3">Popular searches:</p>
        <div 
          className="flex flex-wrap justify-center gap-2"
          role="group"
          aria-labelledby="search-examples-label"
        >
          {[
            'River Thames',
            'River Severn',
            'Manchester',
            'Leeds',
            'York',
            'Bristol'
          ].map((example) => (
            <button
              key={example}
              onClick={() => setSearchQuery(example)}
              className="px-3 py-1 text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 
                         rounded-full transition-colors border border-primary-200 hover:border-primary-300
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={`Search for ${example}`}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Notice */}
      <div 
        className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        role="alert"
        aria-labelledby="emergency-heading"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0" aria-hidden="true">
            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 id="emergency-heading" className="text-sm font-medium text-blue-800">
              Emergency Information
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              This tool provides flood awareness information. For immediate emergencies, 
              call <strong>999</strong> or contact your local emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}