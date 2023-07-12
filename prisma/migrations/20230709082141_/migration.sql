/*
  Warnings:

  - You are about to drop the column `isDisable` on the `Seat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SeatStatusEnum" AS ENUM ('AVAILABLE', 'SELECTED', 'OWNED');

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "isDisable",
ADD COLUMN     "status" "SeatStatusEnum" NOT NULL DEFAULT 'AVAILABLE';
