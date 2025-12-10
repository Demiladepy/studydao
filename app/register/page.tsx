'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const UNIVERSITIES = ['Stanford', 'MIT', 'Harvard', 'UC Berkeley', 'Carnegie Mellon', 'Other']
const COURSES = ['CS229 - Machine Learning', 'CS161 - Algorithms', 'ECON101 - Microeconomics', 'PHYS201 - Mechanics']
const LEARNING_STYLES = ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        courses: [] as string[],
        learningStyle: '',
        goals: '',
        location: '',
        availability: [] as { dayOfWeek: number; startTime: string; endTime: string }[]
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    university: formData.university,
                    courses: formData.courses,
                    learningStyle: formData.learningStyle.toLowerCase(),
                    goals: formData.goals,
                    location: formData.location,
                    availability: formData.availability,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            router.push('/login?registered=true')
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const addAvailability = () => {
        setFormData({
            ...formData,
            availability: [...formData.availability, { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' }]
        })
    }

    const removeAvailability = (index: number) => {
        setFormData({
            ...formData,
            availability: formData.availability.filter((_, i) => i !== index)
        })
    }

    const updateAvailability = (index: number, field: string, value: any) => {
        const updated = [...formData.availability]
        updated[index] = { ...updated[index], [field]: value }
        setFormData({ ...formData, availability: updated })
    }

    const toggleCourse = (course: string) => {
        if (formData.courses.includes(course)) {
            setFormData({ ...formData, courses: formData.courses.filter(c => c !== course) })
        } else {
            setFormData({ ...formData, courses: [...formData.courses, course] })
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
                background: 'var(--color-background)',
                overflowY: 'auto'
            }}>
                <div style={{ width: '100%', maxWidth: '720px', padding: 'var(--space-8) 0' }} className="animate-fade-in">
                    {/* Logo & Header */}
                    <div style={{ marginBottom: 'var(--space-8)' }}>
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
                            marginBottom: 'var(--space-2)',
                            letterSpacing: '-0.02em'
                        }}>
                            Create Account
                        </h1>
                        <p style={{
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Join StudyDAO and start your learning journey
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div style={{ marginBottom: 'var(--space-10)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {[
                                { num: 1, label: 'Account' },
                                { num: 2, label: 'Preferences' },
                                { num: 3, label: 'Availability' }
                            ].map((s, idx) => (
                                <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'var(--font-weight-semibold)',
                                            fontSize: 'var(--font-size-base)',
                                            background: step >= s.num ? 'var(--color-primary)' : 'var(--color-surface)',
                                            color: step >= s.num ? 'white' : 'var(--color-text-tertiary)',
                                            border: step >= s.num ? 'none' : '2px solid var(--color-border)',
                                            transition: 'all var(--transition-base)',
                                            boxShadow: step >= s.num ? 'var(--shadow-sm)' : 'none'
                                        }}>
                                            {s.num}
                                        </div>
                                        <span style={{
                                            marginTop: 'var(--space-2)',
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: 'var(--font-weight-medium)',
                                            color: step >= s.num ? 'var(--color-primary)' : 'var(--color-text-tertiary)'
                                        }}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {idx < 2 && (
                                        <div style={{
                                            flex: 1,
                                            height: '2px',
                                            margin: '0 var(--space-4)',
                                            borderRadius: 'var(--radius-full)',
                                            background: step > s.num ? 'var(--color-primary)' : 'var(--color-border)',
                                            transition: 'all var(--transition-base)',
                                            marginBottom: '32px'
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Step 1: Account Info */}
                        {step === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                                    <div className="input-group">
                                        <label htmlFor="name" className="input-label">Full Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="input"
                                            placeholder="John Doe"
                                            autoComplete="name"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="university" className="input-label">University</label>
                                        <select
                                            id="university"
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            required
                                            className="select"
                                        >
                                            <option value="">Select university</option>
                                            {UNIVERSITIES.map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="email" className="input-label">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="input"
                                        placeholder="you@university.edu"
                                        autoComplete="email"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                                    <div className="input-group">
                                        <label htmlFor="password" className="input-label">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="input"
                                            placeholder="Min. 6 characters"
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="input"
                                            placeholder="Re-enter password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Preferences */}
                        {step === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-4)'
                                    }}>
                                        Select Your Courses
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
                                        {COURSES.map(course => (
                                            <label
                                                key={course}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: 'var(--space-4)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: formData.courses.includes(course)
                                                        ? '2px solid var(--color-primary)'
                                                        : '2px solid var(--color-border)',
                                                    background: formData.courses.includes(course)
                                                        ? 'var(--color-primary-light)'
                                                        : 'var(--color-background)',
                                                    cursor: 'pointer',
                                                    transition: 'all var(--transition-fast)'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.courses.includes(course)}
                                                    onChange={() => toggleCourse(course)}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        marginRight: 'var(--space-3)',
                                                        accentColor: 'var(--color-primary)',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                <span style={{
                                                    fontSize: 'var(--font-size-sm)',
                                                    fontWeight: 'var(--font-weight-medium)',
                                                    color: 'var(--color-text-primary)'
                                                }}>
                                                    {course}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                                    <div className="input-group">
                                        <label htmlFor="learningStyle" className="input-label">Learning Style</label>
                                        <select
                                            id="learningStyle"
                                            value={formData.learningStyle}
                                            onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
                                            className="select"
                                        >
                                            <option value="">Select learning style</option>
                                            {LEARNING_STYLES.map(style => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="location" className="input-label">Location Preference</label>
                                        <input
                                            id="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="input"
                                            placeholder="e.g., Main Library"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="goals" className="input-label">Study Goals</label>
                                    <textarea
                                        id="goals"
                                        value={formData.goals}
                                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                        rows={4}
                                        className="textarea"
                                        placeholder="What do you want to achieve?"
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Availability */}
                        {step === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-4)'
                                    }}>
                                        When are you available to study?
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        {formData.availability.map((slot, index) => (
                                            <div key={index} className="card" style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 'var(--space-3)',
                                                alignItems: 'center',
                                                padding: 'var(--space-4)'
                                            }}>
                                                <select
                                                    value={slot.dayOfWeek}
                                                    onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                                                    className="select"
                                                    style={{ flex: '1 1 140px', minWidth: '140px' }}
                                                >
                                                    {DAYS.map((day, i) => (
                                                        <option key={i} value={i}>{day}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                                    className="input"
                                                    style={{ flex: '0 0 auto', width: '120px' }}
                                                />
                                                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                                    className="input"
                                                    style={{ flex: '0 0 auto', width: '120px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAvailability(index)}
                                                    style={{
                                                        padding: 'var(--space-2)',
                                                        color: 'var(--color-accent)',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: 'pointer',
                                                        transition: 'all var(--transition-fast)'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-light)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addAvailability}
                                        className="btn btn-ghost"
                                        style={{ marginTop: 'var(--space-3)', width: 'fit-content' }}
                                    >
                                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add time slot
                                    </button>
                                </div>
                            </div>
                        )}

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

                        {/* Navigation */}
                        <div style={{
                            display: 'flex',
                            gap: 'var(--space-4)',
                            paddingTop: 'var(--space-6)',
                            borderTop: '1px solid var(--color-border)'
                        }}>
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="btn btn-secondary btn-lg"
                                    style={{ flex: 1 }}
                                >
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: step === 1 ? '1 1 100%' : 1 }}
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: 1 }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            )}
                        </div>
                    </form>

                    <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                        <Link href="/login" style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            transition: 'color var(--transition-fast)'
                        }}>
                            Already have an account? <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)' }}>Sign in</span>
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
                background: 'linear-gradient(135deg, #34a853 0%, #2d8e47 100%)'
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
                            Start Your Journey
                        </h2>
                        <p style={{
                            fontSize: 'var(--font-size-xl)',
                            lineHeight: 'var(--line-height-relaxed)',
                            opacity: 0.95
                        }}>
                            Join thousands of students achieving their academic goals with AI-powered study tools.
                        </p>
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
