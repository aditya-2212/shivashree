-- ─────────────────────────────────────────────────────────────────────────────
-- Adds CMS columns for the Resources → "Notes & guides" (blog listing) page.
-- All nullable TEXT, non-destructive, safe to run more than once.
-- Run this in Supabase → SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogHeroEyebrow"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogHeroHeading"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogHeroIntro"       TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogEmptyText"       TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogCtaText"         TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogCtaButtonLabel"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogMetaTitle"       TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "blogMetaDescription" TEXT;
