import React from 'react'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error' | 'novice' | 'contributor' | 'expert' | 'legend'
    className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variants = {
        default: 'bg-[#e5e7eb] text-[#111827] dark:bg-[#334155] dark:text-[#f1f5f9]',
        success: 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white',
        warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white',
        error: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white',
        novice: 'bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white',
        contributor: 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white',
        expert: 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white',
        legend: 'bg-gradient-to-r from-[#f59e0b] to-[#eab308] text-white shadow-lg animate-glow',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}

export function getReputationBadge(reputation: number): { variant: BadgeProps['variant'], label: string } {
    if (reputation >= 1000) return { variant: 'legend', label: 'Study Legend' }
    if (reputation >= 500) return { variant: 'expert', label: 'Expert Helper' }
    if (reputation >= 200) return { variant: 'contributor', label: 'Contributor' }
    return { variant: 'novice', label: 'Novice' }
}
