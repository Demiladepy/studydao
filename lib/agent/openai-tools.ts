import { prisma } from "@/lib/prisma";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, differenceInMinutes } from "date-fns";
import { findCourseByName, updateStudyGoals, getUserStats, getActiveGoals } from "./db-helpers";

// Tool function implementations for OpenAI
export const toolFunctions = {
    async startTimer(args: { userId: string; subject?: string; notes?: string }) {
        try {
            const { userId, subject, notes } = args;

            // Check if user has an active session
            const activeSession = await prisma.studySession.findFirst({
                where: {
                    userId,
                    status: "active",
                },
                orderBy: {
                    startedAt: "desc",
                },
            });

            if (activeSession) {
                const elapsed = differenceInMinutes(new Date(), activeSession.startedAt);
                const hours = Math.floor(elapsed / 60);
                const mins = elapsed % 60;
                return {
                    success: false,
                    message: `You already have an active study session running for ${hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}. Please stop it first before starting a new one.`,
                    sessionId: activeSession.id,
                };
            }

            // Try to find course by subject name
            let courseId: string | null = null;
            if (subject) {
                courseId = await findCourseByName(userId, subject);
            }

            // Combine subject and notes
            const sessionNotes = subject
                ? (notes ? `${subject} - ${notes}` : subject)
                : notes || null;

            // Create new study session
            const session = await prisma.studySession.create({
                data: {
                    userId,
                    courseId,
                    duration: 0,
                    startedAt: new Date(),
                    status: "active",
                    notes: sessionNotes,
                },
                include: {
                    course: true,
                },
            });

            const subjectText = session.course
                ? `Studying ${session.course.name}`
                : subject
                    ? `Studying ${subject}`
                    : "Let's get focused!";

            return {
                success: true,
                message: `Study timer started! ${subjectText} 🎯`,
                sessionId: session.id,
                startedAt: session.startedAt.toISOString(),
                subject: session.course?.name || subject || null,
            };
        } catch (error) {
            console.error("Error starting timer:", error);
            return {
                success: false,
                message: "Failed to start study timer. Please try again.",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    async stopTimer(args: { userId: string }) {
        try {
            const { userId } = args;

            const activeSession = await prisma.studySession.findFirst({
                where: {
                    userId,
                    status: "active",
                },
                orderBy: {
                    startedAt: "desc",
                },
                include: {
                    course: true,
                },
            });

            if (!activeSession) {
                return {
                    success: false,
                    message: "You don't have an active study session to stop. Start one by saying 'start studying' or 'begin session'!",
                };
            }

            const endedAt = new Date();
            const duration = differenceInMinutes(endedAt, activeSession.startedAt);

            // Update session
            const updatedSession = await prisma.studySession.update({
                where: {
                    id: activeSession.id,
                },
                data: {
                    endedAt,
                    duration,
                    status: "completed",
                },
            });

            // Update study goals
            await updateStudyGoals(userId, duration);

            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            let encouragement = "";
            if (duration >= 120) {
                encouragement = "Incredible focus! 🔥";
            } else if (duration >= 60) {
                encouragement = "Excellent session! 🌟";
            } else if (duration >= 25) {
                encouragement = "Great Pomodoro session! 🍅";
            } else {
                encouragement = "Every minute counts! 💪";
            }

            const subjectText = activeSession.course
                ? ` on ${activeSession.course.name}`
                : activeSession.notes
                    ? ` on ${activeSession.notes}`
                    : "";

            return {
                success: true,
                message: `Great work! You studied for ${durationText}${subjectText}. ${encouragement}`,
                sessionId: updatedSession.id,
                duration,
                durationText,
                hours,
                minutes,
            };
        } catch (error) {
            console.error("Error stopping timer:", error);
            return {
                success: false,
                message: "Failed to stop study timer. Please try again.",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    async showStats(args: { userId: string; period?: "today" | "week" | "month" | "all" }) {
        try {
            const { userId, period = "week" } = args;

            // Use helper function to get stats
            const stats = await getUserStats(userId, period);
            const activeGoals = await getActiveGoals(userId);

            const periodLabel = period === "all" ? "all time" : period;
            const goalText = activeGoals.length > 0
                ? activeGoals.map((goal) => {
                    const progress = Math.round((goal.currentHours / goal.targetHours) * 100);
                    return `\n🎯 ${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal: ${goal.currentHours.toFixed(1)}/${goal.targetHours}h (${progress}%)`;
                }).join("")
                : "\n💡 No active goals. Set one to stay motivated!";

            return {
                success: true,
                stats: {
                    period,
                    totalHours: stats.totalHours,
                    totalMinutes: stats.totalMinutes,
                    sessionCount: stats.sessionCount,
                    averageSessionLength: stats.averageSessionLength,
                    currentStreak: stats.currentStreak,
                    todayMinutes: stats.todayMinutes,
                    todayHours: stats.todayHours,
                    weeklyHours: stats.weeklyHours,
                    weeklyMinutes: stats.weeklyMinutes,
                    activeGoals: activeGoals.map((goal) => ({
                        type: goal.type,
                        targetHours: goal.targetHours,
                        currentHours: goal.currentHours,
                        progress: Math.round((goal.currentHours / goal.targetHours) * 100),
                        periodEnd: goal.periodEnd.toISOString(),
                    })),
                },
                message: `📊 Your Study Stats (${periodLabel}):\n\n⏱️ Total Time: ${stats.totalHours}h (${stats.totalMinutes}m)\n📚 Sessions: ${stats.sessionCount}\n📈 Avg Session: ${stats.averageSessionLength}m\n🔥 Streak: ${stats.currentStreak} days\n📅 Today: ${stats.todayHours}h\n📆 This Week: ${stats.weeklyHours}h${goalText}`,
            };
        } catch (error) {
            console.error("Error getting stats:", error);
            return {
                success: false,
                message: "Failed to retrieve study statistics. Please try again.",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    async setGoal(args: { userId: string; type: "daily" | "weekly" | "monthly"; targetHours: number }) {
        try {
            const { userId, type, targetHours } = args;

            if (targetHours <= 0 || targetHours > 24) {
                return {
                    success: false,
                    message: "Target hours must be between 0 and 24.",
                };
            }

            const now = new Date();
            let periodStart: Date;
            let periodEnd: Date;

            switch (type) {
                case "daily":
                    periodStart = startOfDay(now);
                    periodEnd = endOfDay(now);
                    break;
                case "weekly":
                    periodStart = startOfWeek(now, { weekStartsOn: 1 });
                    periodEnd = endOfWeek(now, { weekStartsOn: 1 });
                    break;
                case "monthly":
                    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                    break;
                default:
                    return {
                        success: false,
                        message: "Invalid goal type. Must be 'daily', 'weekly', or 'monthly'.",
                    };
            }

            // Check for existing active goal of the same type
            const existingGoal = await prisma.studyGoal.findFirst({
                where: {
                    userId,
                    type,
                    completed: false,
                    periodEnd: { gte: now },
                },
            });

            if (existingGoal) {
                // Update existing goal
                const updated = await prisma.studyGoal.update({
                    where: { id: existingGoal.id },
                    data: {
                        targetHours,
                        periodStart,
                        periodEnd,
                    },
                });

                return {
                    success: true,
                    message: `Updated your ${type} goal to ${targetHours} hours! You've got this! 💪`,
                    goalId: updated.id,
                };
            }

            // Create new goal
            const goal = await prisma.studyGoal.create({
                data: {
                    userId,
                    type,
                    targetHours,
                    periodStart,
                    periodEnd,
                },
            });

            return {
                success: true,
                message: `Great! I've set your ${type} goal to ${targetHours} hours. Let's crush it! 🎯`,
                goalId: goal.id,
            };
        } catch (error) {
            console.error("Error setting goal:", error);
            return {
                success: false,
                message: "Failed to set study goal. Please try again.",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    async getMotivation(args: { userId: string }) {
        try {
            const { userId } = args;

            // Get stats using helper
            const stats = await getUserStats(userId, "week");
            const activeGoals = await getActiveGoals(userId);

            let message = "";

            // Build motivational message based on progress
            if (stats.currentStreak >= 7) {
                message = `🔥 Incredible! You're on a ${stats.currentStreak}-day streak! That's amazing consistency. You're building an unstoppable habit!`;
            } else if (stats.currentStreak >= 3) {
                message = `💪 Fantastic! You've maintained a ${stats.currentStreak}-day streak! Every day you study makes you stronger.`;
            } else if (stats.todayHours > 0) {
                message = `🌟 You've already studied ${stats.todayHours} hours today! That's progress, and progress is powerful!`;
            } else if (stats.weeklyHours > 0) {
                message = `📚 You've studied ${stats.weeklyHours} hours this week! You're on the right track.`;
            } else {
                message = `🚀 Every journey starts with a single step! Ready to begin? You've got this!`;
            }

            // Add goal progress if applicable
            if (activeGoals.length > 0) {
                const goal = activeGoals[0];
                const progress = (goal.currentHours / goal.targetHours) * 100;
                if (progress >= 100) {
                    message += `\n\n🎉 AMAZING! You've completed your ${goal.type} goal! You're crushing it!`;
                } else if (progress >= 75) {
                    message += `\n\n🎯 You're ${Math.round(progress)}% to your ${goal.type} goal! So close - keep pushing!`;
                } else if (progress >= 50) {
                    message += `\n\n📈 You're ${Math.round(progress)}% to your ${goal.type} goal! Halfway there - you can do this!`;
                } else {
                    message += `\n\n💪 You're ${Math.round(progress)}% to your ${goal.type} goal. Every hour counts - keep going!`;
                }
            } else {
                message += `\n\n💡 Tip: Set a study goal to stay motivated and track your progress!`;
            }

            // Add encouragement
            message += `\n\nRemember: Consistency beats perfection. Every study session matters! 🌟`;

            return {
                success: true,
                message,
                streak: stats.currentStreak,
                todayHours: stats.todayHours,
                weeklyHours: stats.weeklyHours,
            };
        } catch (error) {
            console.error("Error getting motivation:", error);
            return {
                success: false,
                message: "You're doing great! Remember, every step forward is progress. Keep up the amazing work! 💪",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },
};

// OpenAI function definitions
export const openAITools = [
    {
        type: "function" as const,
        function: {
            name: "startTimer",
            description: "Starts a new study session timer for the user. Can extract subject/course name from natural language. Use this when user says 'start studying [subject]', 'begin session', etc.",
            parameters: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "The ID of the user starting the study session",
                    },
                    subject: {
                        type: "string",
                        description: "Subject or course name extracted from user's message (e.g., 'math', 'physics', 'computer science')",
                    },
                    notes: {
                        type: "string",
                        description: "Additional notes about what the user plans to study",
                    },
                },
                required: ["userId"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "stopTimer",
            description: "Stops the current active study session and calculates the duration. Use this when user says 'done', 'stop', 'finish', 'end session', etc.",
            parameters: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "The ID of the user stopping the study session",
                    },
                },
                required: ["userId"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "showStats",
            description: "Shows comprehensive study statistics for the user. Use this when user says 'show my progress', 'stats', 'my statistics', 'how am I doing', etc.",
            parameters: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "The ID of the user to get statistics for",
                    },
                    period: {
                        type: "string",
                        enum: ["today", "week", "month", "all"],
                        description: "The time period to show stats for: 'today', 'week', 'month', or 'all'. Default to 'week' if not specified.",
                    },
                },
                required: ["userId"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "setGoal",
            description: "Sets a daily, weekly, or monthly study goal for the user. Use this when user says 'I want to study X hours today/week/month', 'set goal of X hours', etc. Extract the number of hours and time period from the message.",
            parameters: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "The ID of the user setting the goal",
                    },
                    type: {
                        type: "string",
                        enum: ["daily", "weekly", "monthly"],
                        description: "The type of goal: 'daily' (today), 'weekly' (this week), or 'monthly' (this month)",
                    },
                    targetHours: {
                        type: "number",
                        description: "The target number of hours to study (extract from user's message)",
                    },
                },
                required: ["userId", "type", "targetHours"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "getMotivation",
            description: "Gets a personalized motivational message based on the user's recent progress and goals. Use this when user says 'feeling unmotivated', 'I'm struggling', 'need motivation', 'help me stay focused', etc.",
            parameters: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "The ID of the user to get motivation for",
                    },
                },
                required: ["userId"],
            },
        },
    },
];
