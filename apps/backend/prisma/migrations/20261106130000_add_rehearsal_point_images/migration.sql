CREATE TYPE "RehearsalPointImageType" AS ENUM ('POINT', 'EQUIPMENT');

CREATE TABLE "RehearsalPointImage" (
    "id" UUID NOT NULL,
    "rehearsalPointId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "type" "RehearsalPointImageType" NOT NULL DEFAULT 'POINT',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RehearsalPointImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RehearsalPointImage_rehearsalPointId_type_position_idx" ON "RehearsalPointImage"("rehearsalPointId", "type", "position");
ALTER TABLE "RehearsalPointImage" ADD CONSTRAINT "RehearsalPointImage_rehearsalPointId_fkey" FOREIGN KEY ("rehearsalPointId") REFERENCES "RehearsalPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
