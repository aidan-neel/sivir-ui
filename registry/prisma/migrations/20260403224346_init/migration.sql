-- CreateEnum
CREATE TYPE "ThemeDurationPresetSlug" AS ENUM ('default', 'snappy', 'instant', 'smooth');

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publisher" TEXT,
    "fontSans" TEXT NOT NULL,
    "fontMono" TEXT NOT NULL,
    "fontHeader" TEXT NOT NULL,
    "radiusBase" TEXT NOT NULL,
    "radiusSm" TEXT NOT NULL,
    "radiusMd" TEXT NOT NULL,
    "radiusLg" TEXT NOT NULL,
    "radiusXl" TEXT NOT NULL,
    "primaryButtonOutline" BOOLEAN NOT NULL DEFAULT false,
    "invertedPanels" BOOLEAN NOT NULL DEFAULT false,
    "durationPreset" "ThemeDurationPresetSlug" NOT NULL DEFAULT 'default',
    "motion" JSONB NOT NULL,
    "light" JSONB NOT NULL,
    "dark" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_slug_key" ON "Theme"("slug");
