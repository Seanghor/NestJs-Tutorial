/*
  Warnings:

  - Changed the type of `status` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Screening` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MovieStatusEnum" AS ENUM ('COMING_SOON', 'NOW_SHOWING', 'END_SHOWING');

-- CreateEnum
CREATE TYPE "ScreeningStatusEnum" AS ENUM ('COMING_SOON', 'NOW_SHOWING', 'END_SHOWING');

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "status",
ADD COLUMN     "status" "MovieStatusEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Screening" DROP COLUMN "status",
ADD COLUMN     "status" "ScreeningStatusEnum" NOT NULL;

-- DropEnum
DROP TYPE "MovieStatus";

-- DropEnum
DROP TYPE "ScreeningStatus";
