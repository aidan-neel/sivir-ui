-- Store each published theme as its complete portable Theme document instead of
-- one column per axis. New optional sections (foundation, tokens, typography,
-- chrome) and future contract versions then need no schema migration.
ALTER TABLE "Theme"
	ADD COLUMN "document" JSONB,
	ADD COLUMN "editTokenHash" TEXT;

UPDATE "Theme"
SET "document" = jsonb_strip_nulls(
	jsonb_build_object(
		'version', "version",
		'slug', "slug",
		'name', "name",
		'description', "description",
		'publisher', "publisher",
		'brand', "brand",
		'neutral', "neutral",
		'radius', "radius",
		'density', "density",
		'motion', "motionFeel",
		'fontSans', "fontSans",
		'fontMono', "fontMono",
		'fontHeader', "fontHeader"
	)
);

ALTER TABLE "Theme"
	ALTER COLUMN "document" SET NOT NULL,
	ALTER COLUMN "version" DROP DEFAULT;

ALTER TABLE "Theme"
	DROP COLUMN "brand",
	DROP COLUMN "neutral",
	DROP COLUMN "radius",
	DROP COLUMN "density",
	DROP COLUMN "motionFeel",
	DROP COLUMN "fontSans",
	DROP COLUMN "fontMono",
	DROP COLUMN "fontHeader";

CREATE INDEX "Theme_createdAt_idx" ON "Theme"("createdAt");

-- Append-only publish log for rate limiting; deleting a theme never frees quota.
CREATE TABLE "PublishEvent" (
	"id" TEXT NOT NULL,
	"clientKey" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "PublishEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PublishEvent_clientKey_createdAt_idx" ON "PublishEvent"("clientKey", "createdAt");
