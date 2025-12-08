-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StudySession" ("courseId", "createdAt", "duration", "endedAt", "id", "notes", "startedAt", "status", "updatedAt", "userId") SELECT "courseId", "createdAt", "duration", "endedAt", "id", "notes", "startedAt", "status", "updatedAt", "userId" FROM "StudySession";
DROP TABLE "StudySession";
ALTER TABLE "new_StudySession" RENAME TO "StudySession";
CREATE INDEX "StudySession_userId_idx" ON "StudySession"("userId");
CREATE INDEX "StudySession_startedAt_idx" ON "StudySession"("startedAt");
CREATE INDEX "StudySession_status_idx" ON "StudySession"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
