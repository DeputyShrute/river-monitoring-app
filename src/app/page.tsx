import SearchHero from '@/components/SearchHero'
import RecentStations from '@/components/RecentStations'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Search */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            UK River Levels
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Clean, fast flood monitoring for emergency situations. 
            Get real-time river levels with weather context.
          </p>
          
          <SearchHero />
        </div>
      </section>

      {/* Recent Stations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <RecentStations />
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Emergency Information
            </h2>
            <p className="text-blue-800">
              This tool provides flood awareness information. For immediate emergencies, 
              contact <strong>999</strong> or your local emergency services.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}