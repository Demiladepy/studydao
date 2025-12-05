-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "learningStyle" TEXT,
    "goals" TEXT,
    "location" TEXT,
    "walletAddress" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "totalTokensEarned" INTEGER NOT NULL DEFAULT 0,
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudyGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "compatibilityScore" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "chatLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudyGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "scheduledTime" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "tokensDistributed" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "arrivedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "activities" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contribution_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sessionId" TEXT,
    "perkId" TEXT,
    "description" TEXT NOT NULL,
    "txHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Perk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_university_idx" ON "User"("university");

-- CreateIndex
CREATE INDEX "Course_university_idx" ON "Course"("university");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_university_key" ON "Course"("code", "university");

-- CreateIndex
CREATE INDEX "UserCourse_userId_idx" ON "UserCourse"("userId");

-- CreateIndex
CREATE INDEX "UserCourse_courseId_idx" ON "UserCourse"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_userId_courseId_key" ON "UserCourse"("userId", "courseId");

-- CreateIndex
CREATE INDEX "Availability_userId_idx" ON "Availability"("userId");

-- CreateIndex
CREATE INDEX "StudyGroup_courseId_idx" ON "StudyGroup"("courseId");

-- CreateIndex
CREATE INDEX "StudyGroup_status_idx" ON "StudyGroup"("status");

-- CreateIndex
CREATE INDEX "GroupMember_groupId_idx" ON "GroupMember"("groupId");

-- CreateIndex
CREATE INDEX "GroupMember_userId_idx" ON "GroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");

-- CreateIndex
CREATE INDEX "Session_groupId_idx" ON "Session"("groupId");

-- CreateIndex
CREATE INDEX "Session_scheduledTime_idx" ON "Session"("scheduledTime");

-- CreateIndex
CREATE INDEX "Session_status_idx" ON "Session"("status");

-- CreateIndex
CREATE INDEX "Attendance_sessionId_idx" ON "Attendance"("sessionId");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_sessionId_userId_key" ON "Attendance"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "Contribution_sessionId_idx" ON "Contribution"("sessionId");

-- CreateIndex
CREATE INDEX "Contribution_userId_idx" ON "Contribution"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_sessionId_userId_key" ON "Contribution"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Perk_category_idx" ON "Perk"("category");

-- CreateIndex
CREATE INDEX "Perk_tier_idx" ON "Perk"("tier");
