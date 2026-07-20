-- Migrate the pre-release ThemeDraft schema to the canonical version-2 Theme contract.
-- Existing rows retain their identity and metadata; legacy values are mapped to the
-- closest supported public axis before the obsolete columns are removed.
ALTER TABLE "Theme"
	ADD COLUMN "version" INTEGER NOT NULL DEFAULT 2,
	ADD COLUMN "brand" TEXT,
	ADD COLUMN "neutral" TEXT NOT NULL DEFAULT 'warm',
	ADD COLUMN "radius" TEXT,
	ADD COLUMN "density" TEXT NOT NULL DEFAULT 'default',
	ADD COLUMN "motionFeel" TEXT;

UPDATE "Theme"
SET
	"brand" = COALESCE("light" ->> 'primary', '#1f9be6'),
	"radius" = CASE
		WHEN NULLIF(regexp_replace("radiusBase", '[^0-9.]', '', 'g'), '')::double precision <= 0.30 THEN 'sharp'
		WHEN NULLIF(regexp_replace("radiusBase", '[^0-9.]', '', 'g'), '')::double precision >= 0.60 THEN 'rounded'
		ELSE 'default'
	END,
	"motionFeel" = CASE
		WHEN "durationPreset" = 'none' THEN 'none'
		WHEN "durationPreset" IN ('snappy', 'crisp', 'swift', 'instant') THEN 'subtle'
		WHEN "durationPreset" IN ('dramatic', 'bounce', 'spring') THEN 'expressive'
		ELSE 'default'
	END;

ALTER TABLE "Theme"
	ALTER COLUMN "brand" SET NOT NULL,
	ALTER COLUMN "radius" SET NOT NULL,
	ALTER COLUMN "motionFeel" SET NOT NULL;

ALTER TABLE "Theme"
	DROP COLUMN "radiusBase",
	DROP COLUMN "radiusSm",
	DROP COLUMN "radiusMd",
	DROP COLUMN "radiusLg",
	DROP COLUMN "radiusXl",
	DROP COLUMN "primaryButtonOutline",
	DROP COLUMN "invertedPanels",
	DROP COLUMN "fancyButtons",
	DROP COLUMN "fancyBadges",
	DROP COLUMN "fancyShadows",
	DROP COLUMN "hapticPress",
	DROP COLUMN "spacing",
	DROP COLUMN "durationPreset",
	DROP COLUMN "motion",
	DROP COLUMN "light",
	DROP COLUMN "dark",
	DROP COLUMN "typography";
