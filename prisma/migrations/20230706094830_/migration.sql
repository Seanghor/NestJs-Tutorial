/*
  Warnings:

  - The values [END_SHOWING] on the enum `MovieStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MovieStatusEnum_new" AS ENUM ('COMING_SOON', 'NOW_SHOWING', 'TOP_MOVIE');
ALTER TABLE "Movie" ALTER COLUMN "status" TYPE "MovieStatusEnum_new" USING ("status"::text::"MovieStatusEnum_new");
ALTER TYPE "MovieStatusEnum" RENAME TO "MovieStatusEnum_old";
ALTER TYPE "MovieStatusEnum_new" RENAME TO "MovieStatusEnum";
DROP TYPE "MovieStatusEnum_old";
COMMIT;
