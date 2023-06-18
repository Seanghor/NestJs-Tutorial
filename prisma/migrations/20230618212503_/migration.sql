-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_auditoriumId_fkey";

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_auditoriumId_fkey" FOREIGN KEY ("auditoriumId") REFERENCES "Auditorium"("id") ON DELETE SET NULL ON UPDATE CASCADE;
