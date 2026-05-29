-- Convert durationPreset from enum → plain text so app-side custom presets
-- (crisp, swift, gentle, dramatic, glide, none, …) save without schema churn.

ALTER TABLE "Theme" ALTER COLUMN "durationPreset" DROP DEFAULT;
ALTER TABLE "Theme" ALTER COLUMN "durationPreset" TYPE TEXT USING "durationPreset"::text;
ALTER TABLE "Theme" ALTER COLUMN "durationPreset" SET DEFAULT 'default';

DROP TYPE IF EXISTS "ThemeDurationPresetSlug";
