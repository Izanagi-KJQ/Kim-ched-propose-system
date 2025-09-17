-- AlterTable - Add missing fields to Application table and rename gpa to gwa
ALTER TABLE "public"."Application" DROP COLUMN "gpa",
ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "city" TEXT,
ADD COLUMN     "documents" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "gwa" DOUBLE PRECISION,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "schoolSector" TEXT;