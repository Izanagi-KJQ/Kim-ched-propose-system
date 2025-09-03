-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "lastActive" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "avatar" TEXT
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "applicants" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "type" TEXT
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "birthdate" DATETIME,
    "region" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "gpa" REAL,
    "status" TEXT NOT NULL,
    "submittedDate" DATETIME NOT NULL,
    "avatar" TEXT NOT NULL,
    "review" TEXT,
    "score" REAL,
    "userId" TEXT,
    CONSTRAINT "Application_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
