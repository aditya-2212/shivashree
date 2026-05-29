-- ─────────────────────────────────────────────────────────────────────────────
-- Adds the new CMS columns for:
--   • Blog SEO        → blog_posts.seoTitle / seoDescription   (Job 4)
--   • Page copy + SEO → site_settings.* (About, Home, Contact, FAQs)  (Job 3)
--
-- All columns are nullable TEXT. This is non-destructive: existing rows keep
-- NULL, and every public page falls back to its built-in default text until an
-- editor fills the field in Admin → Site Settings. Safe to run more than once
-- (uses IF NOT EXISTS).
--
-- Run this in Supabase → SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Job 4: Blog SEO ───────────────────────────────────────────────────────────
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS "seoTitle"       TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

-- ── Job 3: Homepage — callback form copy ──────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "homeFormTitle"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "homeFormNote"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "homeCallLabel"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "homeCallSuffix" TEXT;

-- ── Job 3: Per-page SEO meta ──────────────────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "homeMetaTitle"          TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "homeMetaDescription"    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutMetaTitle"         TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutMetaDescription"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "contactMetaTitle"       TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "contactMetaDescription" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsMetaTitle"          TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsMetaDescription"    TEXT;

-- ── Job 3: About page — Vision & Mission ──────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutVisionLabel"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutVisionBody"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutMissionLabel" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutMissionBody"  TEXT;

-- ── Job 3: About page — Our Process ───────────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcessEyebrow" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcessHeading" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess1Title"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess1Body"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess2Title"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess2Body"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess3Title"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess3Body"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess4Title"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutProcess4Body"   TEXT;

-- ── Job 3: About page — Quality Guarantee ─────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQualityEyebrow"    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQualityHeading"    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQualityIntro"      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQualitySubheading" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality1Title"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality1Body"      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality2Title"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality2Body"      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality3Title"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality3Body"      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality4Title"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality4Body"      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality5Title"     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutQuality5Body"      TEXT;

-- ── Job 3: About page — Our Promise ───────────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromiseTitle"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromiseNote"   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise1Label" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise1Desc"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise2Label" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise2Desc"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise3Label" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise3Desc"  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise4Label" TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "aboutPromise4Desc"  TEXT;

-- ── Job 3: FAQs page copy ─────────────────────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsHeroEyebrow"    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsHeroHeading"    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsHeroIntro"      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsCtaText"        TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "faqsCtaButtonLabel" TEXT;
