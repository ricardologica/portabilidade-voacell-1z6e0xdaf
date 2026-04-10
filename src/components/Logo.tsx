import React from 'react'
import { Cloud } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'white'
}) {
  return (
    <div className={cn('flex items-center gap-2 font-bold text-xl', className)}>
      <div
        className={cn(
          'flex items-center justify-center p-1.5 rounded-lg',
          variant === 'default' ? 'bg-primary text-white' : 'bg-white text-primary',
        )}
      >
        <Cloud size={24} strokeWidth={2.5} />
      </div>
      <span
        className={cn('tracking-tight', variant === 'default' ? 'text-secondary' : 'text-white')}
      >
        Voacell
      </span>
    </div>
  )
}
