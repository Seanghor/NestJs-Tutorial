/*
  Warnings:

  - You are about to drop the column `seat` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "seat",
ADD COLUMN     "seatId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
