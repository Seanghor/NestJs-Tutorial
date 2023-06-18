/*
  Warnings:

  - Added the required column `date_show` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "date_show" TIMESTAMP(3) NOT NULL;
