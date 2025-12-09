'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const UNIVERSITIES = ['Stanford', 'MIT', 'Harvard', 'UC Berkeley', 'Carnegie Mellon']
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
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-12">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

            <div className="relative z-10 w-full max-w-3xl animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="heading-2 gradient-text mb-2">Join StudyDAO</h1>
                    <p className="body-medium text-gray-600">Create your profile and find your perfect study group</p>
                </div>

                <Card variant="glass" className="p-8 shadow-2xl">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {[
                                { num: 1, label: 'Account' },
                                { num: 2, label: 'Preferences' },
                                { num: 3, label: 'Availability' }
                            ].map((s, idx) => (
                                <div key={s.num} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= s.num
                                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {s.num}
                                        </div>
                                        <span className={`mt-2 text-sm font-medium ${step >= s.num ? 'text-indigo-600' : 'text-gray-500'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {idx < 2 && (
                                        <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${step > s.num ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Account Info */}
                        {step === 1 && (
                            <div className="space-y-5 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="input pl-12"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">University</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <select
                                                value={formData.university}
                                                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                                required
                                                className="input pl-12"
                                            >
                                                <option value="">Select university</option>
                                                {UNIVERSITIES.map(uni => (
                                                    <option key={uni} value={uni}>{uni}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block body-small font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="input pl-12"
                                            placeholder="you@university.edu"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                minLength={6}
                                                className="input pl-12"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                                className="input pl-12"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Preferences */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block body-medium font-semibold text-gray-900 mb-3">Select Your Courses</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {COURSES.map(course => (
                                            <label
                                                key={course}
                                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.courses.includes(course)
                                                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-500 shadow-md'
                                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.courses.includes(course)}
                                                    onChange={() => toggleCourse(course)}
                                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 mr-3"
                                                />
                                                <span className="body-small font-medium text-gray-900">{course}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Learning Style</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                            <select
                                                value={formData.learningStyle}
                                                onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
                                                className="input pl-12"
                                            >
                                                <option value="">Select learning style</option>
                                                {LEARNING_STYLES.map(style => (
                                                    <option key={style} value={style}>{style}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Location Preference</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="input pl-12"
                                                placeholder="e.g., Main Library, West Campus"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block body-small font-medium text-gray-700 mb-2">Study Goals</label>
                                    <textarea
                                        value={formData.goals}
                                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                        rows={3}
                                        className="input resize-none"
                                        placeholder="What do you want to achieve? (e.g., Master ML concepts, prepare for finals...)"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Availability */}
                        {step === 3 && (
                            <div className="space-y-5 animate-fadeIn">
                                <div>
                                    <label className="block body-medium font-semibold text-gray-900 mb-3">When are you available to study?</label>
                                    <div className="space-y-3">
                                        {formData.availability.map((slot, index) => (
                                            <div key={index} className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <select
                                                    value={slot.dayOfWeek}
                                                    onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                                                    className="flex-1 min-w-[140px] px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                >
                                                    {DAYS.map((day, i) => (
                                                        <option key={i} value={i}>{day}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                />
                                                <span className="text-gray-500 font-medium">to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAvailability(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addAvailability}
                                        className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium body-small"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add time slot
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl animate-scaleIn">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="body-small text-red-700">{error}</span>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                            )}

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    variant="primary"
                                    size="lg"
                                    className={step === 1 ? 'w-full' : 'flex-1'}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="primary"
                                    size="lg"
                                    className="flex-1"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="body-small text-gray-600 hover:text-indigo-600 transition-colors">
                            Already have an account? <span className="font-semibold">Sign in</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
