import React from 'react'
import { cn } from '@/lib/utils'
import logoUrl from '@/assets/captura-de-tela-2026-04-15-220859-1e091.png'

export function Logo({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'white'
}) {
  return (
    <div className={cn('flex items-center gap-2 font-bold text-xl', className)}>
      <img
        src={logoUrl}
        alt="Voacell"
        className={cn(
          'h-10 object-contain rounded-md',
          variant === 'white' && 'brightness-0 invert',
        )}
      />
    </div>
  )
}
