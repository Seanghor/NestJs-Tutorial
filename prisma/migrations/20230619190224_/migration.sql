/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ticket_customId_key" ON "Ticket"("customId");
