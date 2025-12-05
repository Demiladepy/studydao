import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'glass' | 'gradient'
    hover?: boolean
    onClick?: () => void
}

export function Card({ children, className = '', variant = 'default', hover = false, onClick }: CardProps) {
    const baseStyles = 'rounded-2xl transition-all duration-300'

    const variants = {
        default: 'bg-white border border-gray-200 shadow-md',
        glass: 'bg-white/95 backdrop-blur-xl border border-white/50 shadow-xl',
        gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg'
    }

    const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : ''
    const clickStyles = onClick ? 'cursor-pointer active:scale-[0.98]' : ''

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${clickStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`p-6 pb-4 ${className}`}>
            {children}
        </div>
    )
}

interface CardTitleProps {
    children: React.ReactNode
    className?: string
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-2xl font-bold text-gray-900 ${className}`}>
            {children}
        </h3>
    )
}

interface CardContentProps {
    children: React.ReactNode
    className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={`p-6 pt-2 ${className}`}>
            {children}
        </div>
    )
}
