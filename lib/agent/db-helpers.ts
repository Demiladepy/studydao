import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, differenceInDays } from "date-fns";

export interface StudyStats {
  totalHours: number;
  totalMinutes: number;
  sessionCount: number;
  averageSessionLength: number;
  currentStreak: number;
  todayMinutes: number;
  todayHours: number;
  weeklyHours: number;
  weeklyMinutes: number;
}

export interface ActiveSession {
  id: string;
  startedAt: Date;
  courseName?: string;
  notes?: string;
}

/**
 * Get user's study statistics for a given period
 */
export async function getUserStats(
  userId: string,
  period: "today" | "week" | "month" | "all" = "week"
): Promise<StudyStats> {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "today":
      startDate = startOfDay(now);
      break;
    case "week":
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(0);
  }

  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      status: "completed",
      startedAt: period !== "all" ? { gte: startDate } : undefined,
    },
    include: {
      course: true,
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  const totalMinutes = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  const totalHours = totalMinutes / 60;
  const sessionCount = sessions.length;
  const averageSessionLength = sessionCount > 0 ? totalMinutes / sessionCount : 0;

  // Calculate today's stats
  const todaySessions = await prisma.studySession.findMany({
    where: {
      userId,
      status: "completed",
      startedAt: { gte: startOfDay(now) },
    },
  });
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Calculate weekly stats
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weeklySessions = await prisma.studySession.findMany({
    where: {
      userId,
      status: "completed",
      startedAt: { gte: weekStart },
    },
  });
  const weeklyMinutes = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Calculate streak
  const streak = await calculateStreak(userId);

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    totalMinutes,
    sessionCount,
    averageSessionLength: Math.round(averageSessionLength),
    currentStreak: streak,
    todayMinutes,
    todayHours: Math.round((todayMinutes / 60) * 100) / 100,
    weeklyHours: Math.round((weeklyMinutes / 60) * 100) / 100,
    weeklyMinutes,
  };
}

/**
 * Get user's active study session
 */
export async function getActiveSession(userId: string): Promise<ActiveSession | null> {
  const session = await prisma.studySession.findFirst({
    where: {
      userId,
      status: "active",
    },
    include: {
      course: true,
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  if (!session) return null;

  return {
    id: session.id,
    startedAt: session.startedAt,
    courseName: session.course?.name,
    notes: session.notes || undefined,
  };
}

/**
 * Find course by name (fuzzy matching)
 */
export async function findCourseByName(
  userId: string,
  courseName: string
): Promise<string | null> {
  // First, try to find in user's enrolled courses
  const userCourses = await prisma.userCourse.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
  });

  // Try exact match first
  const exactMatch = userCourses.find(
    (uc) => uc.course.name.toLowerCase() === courseName.toLowerCase()
  );
  if (exactMatch) return exactMatch.courseId;

  // Try partial match
  const partialMatch = userCourses.find(
    (uc) => uc.course.name.toLowerCase().includes(courseName.toLowerCase()) ||
    courseName.toLowerCase().includes(uc.course.name.toLowerCase())
  );
  if (partialMatch) return partialMatch.courseId;

  // Try code match
  const codeMatch = userCourses.find(
    (uc) => uc.course.code.toLowerCase() === courseName.toLowerCase()
  );
  if (codeMatch) return codeMatch.courseId;

  return null;
}

/**
 * Calculate study streak
 */
async function calculateStreak(userId: string): Promise<number> {
  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      status: "completed",
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  if (sessions.length === 0) return 0;

  // Get unique study dates
  const studyDates = new Set(
    sessions.map((s) => {
      const date = new Date(s.startedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  const dates = Array.from(studyDates)
    .map((timestamp) => new Date(timestamp))
    .sort((a, b) => b.getTime() - a.getTime());

  if (dates.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  let currentDate = startOfDay(today);

  for (const studyDate of dates) {
    const studyDay = startOfDay(studyDate);
    const diffDays = Math.floor(
      (currentDate.getTime() - studyDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Update study goals with completed session
 */
export async function updateStudyGoals(userId: string, minutesStudied: number): Promise<void> {
  const hoursStudied = minutesStudied / 60;
  const now = new Date();

  const activeGoals = await prisma.studyGoal.findMany({
    where: {
      userId,
      completed: false,
      periodEnd: { gte: now },
    },
  });

  for (const goal of activeGoals) {
    const newCurrentHours = goal.currentHours + hoursStudied;
    const isCompleted = newCurrentHours >= goal.targetHours;

    await prisma.studyGoal.update({
      where: { id: goal.id },
      data: {
        currentHours: newCurrentHours,
        completed: isCompleted,
      },
    });
  }
}

/**
 * Get active goals for user
 */
export async function getActiveGoals(userId: string) {
  const now = new Date();
  return await prisma.studyGoal.findMany({
    where: {
      userId,
      completed: false,
      periodEnd: { gte: now },
    },
    orderBy: {
      periodStart: "desc",
    },
  });
}

