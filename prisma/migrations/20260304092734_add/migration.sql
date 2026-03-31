-- CreateEnum
CREATE TYPE "EaterSize" AS ENUM ('SMALL', 'MEDIUM', 'XL');

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eaterSize" "EaterSize" NOT NULL,
    "noPork" BOOLEAN NOT NULL DEFAULT false,
    "noAlcohol" BOOLEAN NOT NULL DEFAULT false,
    "isVeggie" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
