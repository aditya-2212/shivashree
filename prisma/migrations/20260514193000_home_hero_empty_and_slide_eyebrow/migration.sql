-- Optional homepage hero copy when CMS has no slides/images, and slide eyebrow default.
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homeHeroSlideEyebrowFallback" TEXT;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homeHeroEmptyEyebrow" TEXT;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homeHeroEmptyHeading" TEXT;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homeHeroEmptyCtaLabel" TEXT;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homeHeroEmptyCtaUrl" TEXT;
