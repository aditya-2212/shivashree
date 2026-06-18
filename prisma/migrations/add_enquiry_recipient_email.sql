-- ─────────────────────────────────────────────────────────────────────────────
-- Adds the editable "where enquiry emails go" setting and points it at finance@.
-- Run this in Supabase → SQL Editor. Safe to run more than once.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS "enquiryRecipientEmail" TEXT;

UPDATE site_settings
SET "enquiryRecipientEmail" = 'finance@shivashreedevelopers.com'
WHERE id = 1;
