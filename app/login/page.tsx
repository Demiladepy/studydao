'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-surface)' }}>
            {/* Left Side - Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-8)',
                background: 'var(--color-background)'
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-in">
                    {/* Logo & Header */}
                    <div style={{ marginBottom: 'var(--space-12)' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-xl)',
                            background: 'var(--color-primary)',
                            marginBottom: 'var(--space-6)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 style={{
                            fontSize: 'var(--font-size-4xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text-primary)',
                            marginBottom: 'var(--space-3)',
                            letterSpacing: '-0.02em'
                        }}>
                            Sign in
                        </h1>
                        <p style={{
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 'var(--line-height-normal)'
                        }}>
                            Welcome back to StudyDAO
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password" className="input-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                padding: 'var(--space-4)',
                                background: 'var(--color-accent-light)',
                                border: '1px solid var(--color-accent)',
                                borderRadius: 'var(--radius-md)',
                                animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <svg style={{ width: '20px', height: '20px', color: 'var(--color-accent)', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-hover)', fontWeight: 'var(--font-weight-medium)' }}>
                                    {error}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg btn-full"
                        >
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <svg style={{ width: '20px', height: '20px' }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ marginTop: 'var(--space-8)' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '100%', borderTop: '1px solid var(--color-border)' }}></div>
                            </div>
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                <span style={{
                                    padding: '0 var(--space-4)',
                                    background: 'var(--color-background)',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    New to StudyDAO?
                                </span>
                            </div>
                        </div>

                        <Link href="/register" style={{ display: 'block', marginTop: 'var(--space-6)' }}>
                            <button type="button" className="btn btn-secondary btn-lg btn-full">
                                Create account
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Brand Experience */}
            <div style={{
                display: 'none',
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
                '@media (min-width: 1024px)': {
                    display: 'flex'
                }
            }} className="hidden lg:flex">
                {/* Subtle Grid Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '48px 48px'
                }}></div>

                {/* Floating Shapes */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '15%',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 6s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    width: '250px',
                    height: '250px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    filter: 'blur(50px)',
                    animation: 'float 8s ease-in-out infinite',
                    animationDelay: '2s'
                }}></div>

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    padding: 'var(--space-12)',
                    width: '100%'
                }}>
                    <div style={{ maxWidth: '480px' }}>
                        <h2 style={{
                            fontSize: 'var(--font-size-5xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            marginBottom: 'var(--space-6)',
                            lineHeight: 'var(--line-height-tight)',
                            letterSpacing: '-0.02em'
                        }}>
                            Welcome to StudyDAO
                        </h2>
                        <p style={{
                            fontSize: 'var(--font-size-xl)',
                            lineHeight: 'var(--line-height-relaxed)',
                            opacity: 0.95,
                            marginBottom: 'var(--space-8)'
                        }}>
                            Your AI-powered study companion that helps you track sessions, set goals, and stay motivated.
                        </p>

                        {/* Feature Pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            {['Smart Timer', 'Goal Tracking', 'AI Motivation'].map((feature) => (
                                <div key={feature} style={{
                                    padding: 'var(--space-2) var(--space-4)',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @media (min-width: 1024px) {
                    .lg\\:flex {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    )
}
