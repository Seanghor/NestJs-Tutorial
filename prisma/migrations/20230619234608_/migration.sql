-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "payStatus" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "payStatus" BOOLEAN NOT NULL DEFAULT false;
