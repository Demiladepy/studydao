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

            <div className="relative z-10 w-full max-w-3xl animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="heading-2 gradient-text mb-2">Join StudyDAO</h1>
                    <p className="body-medium text-gray-600">Create your profile and find your perfect study group</p>
                </div>

                <Card variant="glass" className="p-8">
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
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="input"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">University</label>
                                        <select
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            required
                                            className="input"
                                        >
                                            <option value="">Select university</option>
                                            {UNIVERSITIES.map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block body-small font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="input"
                                        placeholder="you@university.edu"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Password</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="input"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="input"
                                            placeholder="••••••••"
                                        />
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
                                        <select
                                            value={formData.learningStyle}
                                            onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
                                            className="input"
                                        >
                                            <option value="">Select learning style</option>
                                            {LEARNING_STYLES.map(style => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block body-small font-medium text-gray-700 mb-2">Location Preference</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="input"
                                            placeholder="e.g., Main Library, West Campus"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block body-small font-medium text-gray-700 mb-2">Study Goals</label>
                                    <textarea
                                        value={formData.goals}
                                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                        rows={3}
                                        className="input"
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
                                                    className="flex-1 min-w-[140px] px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                                                >
                                                    {DAYS.map((day, i) => (
                                                        <option key={i} value={i}>{day}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                                                />
                                                <span className="text-gray-500">to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
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
