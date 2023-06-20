-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "customId" TEXT,
    "auditoriumId" INTEGER,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_auditoriumId_fkey" FOREIGN KEY ("auditoriumId") REFERENCES "Auditorium"("id") ON DELETE SET NULL ON UPDATE CASCADE;
