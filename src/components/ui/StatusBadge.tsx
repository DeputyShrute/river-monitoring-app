import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { StationStatus } from '@/lib/types'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StationStatus
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  animated?: boolean
}

const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size = 'md', showText = true, animated = false, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-full font-medium',
      'border transition-all duration-200',
    ]

    const statusConfig = {
      normal: {
        label: 'Normal',
        emoji: '🟢',
        classes: 'bg-status-normal/10 text-status-normal border-status-normal/20',
        description: 'River levels are within normal range',
      },
      elevated: {
        label: 'Elevated',
        emoji: '🟡',
        classes: 'bg-status-elevated/10 text-status-elevated border-status-elevated/20',
        description: 'River levels are elevated but not concerning',
      },
      warning: {
        label: 'Warning',
        emoji: '🔴',
        classes: 'bg-status-warning/10 text-status-warning border-status-warning/20',
        description: 'River levels indicate potential flood risk',
      },
      severe: {
        label: 'Severe',
        emoji: '🚨',
        classes: 'bg-status-severe/10 text-status-severe border-status-severe/20',
        description: 'Severe flood risk - take immediate precautions',
      },
      unknown: {
        label: 'Unknown',
        emoji: '⚫',
        classes: 'bg-gray-100 text-gray-600 border-gray-200',
        description: 'Status unknown - data may be unavailable',
      },
    }

    const sizes = {
      sm: showText ? 'px-2 py-1 text-xs' : 'h-6 w-6 text-xs',
      md: showText ? 'px-3 py-1.5 text-sm' : 'h-8 w-8 text-sm',
      lg: showText ? 'px-4 py-2 text-base' : 'h-10 w-10 text-base',
    }

    const config = statusConfig[status] || statusConfig.unknown
    
    return (
      <span
        className={cn(
          baseClasses,
          config.classes,
          sizes[size],
          animated && 'animate-pulse-slow',
          className
        )}
        title={config.description}
        aria-label={`River status: ${config.label}. ${config.description}`}
        ref={ref}
        {...props}
      >
        <span className="mr-1" aria-hidden="true">
          {config.emoji}
        </span>
        {showText && (
          <span className="font-medium">
            {config.label}
          </span>
        )}
      </span>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

export default StatusBadge