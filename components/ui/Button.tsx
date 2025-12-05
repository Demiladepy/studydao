import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
    icon?: React.ReactNode
    fullWidth?: boolean
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    icon,
    fullWidth = false,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 focus:ring-indigo-500/20',
        secondary: 'bg-white text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 focus:ring-indigo-500/20',
        outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500/20',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500/20',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 focus:ring-red-500/20'
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm h-9',
        md: 'px-6 py-3 text-base h-11',
        lg: 'px-8 py-4 text-lg h-14'
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    )
}
