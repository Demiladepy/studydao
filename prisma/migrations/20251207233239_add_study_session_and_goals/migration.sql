-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "duration" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudyGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetHours" INTEGER NOT NULL,
    "currentHours" REAL NOT NULL DEFAULT 0,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudyGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudySession_userId_idx" ON "StudySession"("userId");

-- CreateIndex
CREATE INDEX "StudySession_startedAt_idx" ON "StudySession"("startedAt");

-- CreateIndex
CREATE INDEX "StudySession_status_idx" ON "StudySession"("status");

-- CreateIndex
CREATE INDEX "StudyGoal_userId_idx" ON "StudyGoal"("userId");

-- CreateIndex
CREATE INDEX "StudyGoal_periodStart_idx" ON "StudyGoal"("periodStart");

-- CreateIndex
CREATE INDEX "StudyGoal_periodEnd_idx" ON "StudyGoal"("periodEnd");

-- CreateIndex
CREATE INDEX "StudyGoal_type_idx" ON "StudyGoal"("type");
