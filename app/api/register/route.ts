import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    university: z.string().min(2),
    courses: z.array(z.string()).optional(),
    learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading', 'reading/writing']).optional(),
    goals: z.string().optional(),
    location: z.string().optional(),
    availability: z.array(z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
    })).optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                university: validatedData.university,
                learningStyle: validatedData.learningStyle,
                goals: validatedData.goals,
                location: validatedData.location,
            }
        })

        // Add courses if provided
        if (validatedData.courses && validatedData.courses.length > 0) {
            for (const courseCode of validatedData.courses) {
                // Find or create course
                let course = await prisma.course.findUnique({
                    where: {
                        code_university: {
                            code: courseCode,
                            university: validatedData.university
                        }
                    }
                })

                if (!course) {
                    course = await prisma.course.create({
                        data: {
                            code: courseCode,
                            name: courseCode, // Will be updated later with full name
                            university: validatedData.university
                        }
                    })
                }

                // Link user to course
                await prisma.userCourse.create({
                    data: {
                        userId: user.id,
                        courseId: course.id
                    }
                })
            }
        }

        // Add availability if provided
        if (validatedData.availability && validatedData.availability.length > 0) {
            await prisma.availability.createMany({
                data: validatedData.availability.map(slot => ({
                    userId: user.id,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                }))
            })
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                university: user.university,
            }
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: (error as any).errors },
                { status: 400 }
            )
        }

        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
