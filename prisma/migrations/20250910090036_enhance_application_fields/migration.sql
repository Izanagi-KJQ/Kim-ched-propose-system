/*
  Warnings:

  - You are about to drop the column `civilStatus` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `gpa` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Application` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "birthdate" DATETIME,
    "gender" TEXT,
    "mobileNumber" TEXT,
    "region" TEXT NOT NULL,
    "city" TEXT,
    "email" TEXT NOT NULL,
    "schoolSector" TEXT,
    "scholarshipId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "gwa" REAL,
    "status" TEXT NOT NULL,
    "submittedDate" DATETIME NOT NULL,
    "documents" TEXT,
    "avatar" TEXT NOT NULL,
    "review" TEXT,
    "score" REAL,
    "userId" TEXT,
    CONSTRAINT "Application_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("amount", "avatar", "birthdate", "city", "email", "firstName", "gender", "id", "lastName", "middleName", "mobileNumber", "name", "region", "review", "scholarshipId", "score", "status", "submittedDate", "userId") SELECT "amount", "avatar", "birthdate", "city", "email", "firstName", "gender", "id", "lastName", "middleName", "mobileNumber", "name", "region", "review", "scholarshipId", "score", "status", "submittedDate", "userId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
