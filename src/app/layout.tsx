import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UK River Levels | Emergency Flood Monitoring',
  description: 'Clean, fast flood monitoring for the UK. Get real-time river levels, weather context, and emergency-ready flood risk assessment.',
  keywords: ['flood monitoring', 'river levels', 'UK flooding', 'Environment Agency', 'emergency', 'weather'],
  authors: [{ name: 'UK River Levels Team' }],
  openGraph: {
    title: 'UK River Levels | Emergency Flood Monitoring',
    description: 'Real-time UK flood monitoring with Google-style simplicity',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 text-gray-900 antialiased`}>
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:z-50"
        >
          Skip to main content
        </a>

        <div className="min-h-full flex flex-col">
          <header role="banner" className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-blue-600">
                    UK River Levels
                  </h1>
                </div>
                <nav role="navigation" aria-label="Main navigation" className="hidden md:flex space-x-8">
                  <a 
                    href="/" 
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                    aria-current="page"
                  >
                    Home
                  </a>
                  <a 
                    href="/search" 
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Search Stations
                  </a>
                  <a 
                    href="/map" 
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Map View
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main id="main-content" role="main" className="flex-1">
            {children}
          </main>

          <footer role="contentinfo" className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">
                  Data provided by the Environment Agency flood and river level data from the real-time data API (Beta)
                </p>
                <p className="text-xs text-gray-500">
                  This application is designed for flood awareness. 
                  <strong> In case of immediate danger, contact emergency services directly.</strong>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}