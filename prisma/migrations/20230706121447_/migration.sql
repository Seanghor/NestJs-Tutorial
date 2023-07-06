-- CreateEnum
CREATE TYPE "MovieTypeEnum" AS ENUM ('ACTION', 'COMEDY', 'HORRO', 'DRAMA');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "movieType" "MovieTypeEnum" NOT NULL DEFAULT 'ACTION',
ADD COLUMN     "trailer" TEXT;
