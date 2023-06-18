/*
  Warnings:

  - Added the required column `duration_min` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "duration_min" INTEGER NOT NULL;
