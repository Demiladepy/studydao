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
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-2xl py-8">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join StudyDAO and start your learning journey</p>
                    </div>

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
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step >= s.num
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {s.num}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-purple-600' : 'text-gray-500'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {idx < 2 && (
                                        <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${step > s.num ? 'bg-purple-600' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Account Info */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                                        <select
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="">Select university</option>
                                            {UNIVERSITIES.map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="you@university.edu"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Preferences */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">Select Your Courses</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {COURSES.map(course => (
                                            <label
                                                key={course}
                                                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.courses.includes(course)
                                                    ? 'bg-purple-50 border-purple-500'
                                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.courses.includes(course)}
                                                    onChange={() => toggleCourse(course)}
                                                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mr-3"
                                                />
                                                <span className="text-sm font-medium text-gray-900">{course}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style</label>
                                        <select
                                            value={formData.learningStyle}
                                            onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="">Select learning style</option>
                                            {LEARNING_STYLES.map(style => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location Preference</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="e.g., Main Library"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Study Goals</label>
                                    <textarea
                                        value={formData.goals}
                                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        placeholder="What do you want to achieve?"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Availability */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">When are you available to study?</label>
                                    <div className="space-y-3">
                                        {formData.availability.map((slot, index) => (
                                            <div key={index} className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <select
                                                    value={slot.dayOfWeek}
                                                    onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                                                    className="flex-1 min-w-[140px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                >
                                                    {DAYS.map((day, i) => (
                                                        <option key={i} value={i}>{day}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                                <span className="text-gray-500 font-medium">to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                        className="mt-3 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
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
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-red-700">{error}</span>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className={`${step === 1 ? 'w-full' : 'flex-1'} py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all`}
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                            Already have an account? <span className="font-semibold">Sign in</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Gradient Background */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
                {/* Animated Circles */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-12">
                    <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
                    <p className="text-xl text-purple-100 max-w-md">
                        Join thousands of students achieving their academic goals with AI-powered study groups
                    </p>
                </div>
            </div>
        </div>
    )
}
