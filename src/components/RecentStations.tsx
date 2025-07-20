'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import type { Station } from '@/lib/types'

// Mock data for recent stations (would come from localStorage/API in real app)
const mockRecentStations: Station[] = [
  {
    id: 'river-aire-saltaire',
    label: 'River Aire at Saltaire',
    riverName: 'River Aire',
    town: 'Saltaire',
    lat: 53.8381,
    long: -1.7844,
    status: 'warning',
    catchmentName: 'Aire and Calder',
  },
  {
    id: 'river-thames-kingston',
    label: 'River Thames at Kingston',
    riverName: 'River Thames',
    town: 'Kingston upon Thames',
    lat: 51.4085,
    long: -0.2749,
    status: 'normal',
    catchmentName: 'Thames',
  },
  {
    id: 'river-severn-shrewsbury',
    label: 'River Severn at Shrewsbury',
    riverName: 'River Severn',
    town: 'Shrewsbury',
    lat: 52.7081,
    long: -2.7528,
    status: 'elevated',
    catchmentName: 'Severn',
  },
]

interface RecentStationsProps {
  onStationClick?: (station: Station) => void
}

export default function RecentStations({ onStationClick }: RecentStationsProps) {
  const [recentStations, setRecentStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading recent stations from localStorage or API
    const loadRecentStations = async () => {
      try {
        // In a real app, this would load from localStorage or API
        await new Promise(resolve => setTimeout(resolve, 500))
        setRecentStations(mockRecentStations)
      } catch (error) {
        console.error('Failed to load recent stations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecentStations()
  }, [])

  const formatLastViewed = (stationId: string) => {
    // Mock last viewed times
    const times = {
      'river-aire-saltaire': '2 hours ago',
      'river-thames-kingston': '1 day ago',
      'river-severn-shrewsbury': '3 days ago',
    }
    return times[stationId as keyof typeof times] || 'Recently'
  }

  const handleStationClick = (station: Station) => {
    onStationClick?.(station)
    // In real app, would navigate to station detail page
    console.log('Navigate to station:', station.id)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Recent Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-40"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recentStations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Clock className="h-full w-full" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Recent Stations</h2>
        <p className="text-gray-600 mb-6">
          Search for stations above to start monitoring river levels in your area.
        </p>
        <Button variant="secondary">
          Browse All Stations
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Stations</h2>
        <Button variant="ghost" className="text-primary-600 hover:text-primary-700">
          View All
        </Button>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentStations.map((station) => (
          <Card
            key={station.id}
            variant="interactive"
            className="h-full cursor-pointer group"
            onClick={() => handleStationClick(station)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
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
              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {station.catchmentName} catchment
                </span>
              </div>

              {/* Status Details */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm">
                  <StatusBadge 
                    status={station.status} 
                    size="sm"
                  />
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatLastViewed(station.id)}
                </div>
              </div>

              {/* Mock trend indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Latest reading
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {station.status === 'warning' ? '2.4m' : 
                   station.status === 'elevated' ? '1.8m' : '1.2m'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <Button variant="secondary" className="flex-1">
          <MapPin className="mr-2 h-4 w-4" />
          View Station Map
        </Button>
        <Button variant="secondary" className="flex-1">
          <TrendingUp className="mr-2 h-4 w-4" />
          Current Alerts
        </Button>
      </div>
    </div>
  )
}