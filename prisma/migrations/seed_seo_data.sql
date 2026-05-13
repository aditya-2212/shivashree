-- ─────────────────────────────────────────────────────────────────────────────
-- One-time SEO seed: updates slugs, seo titles, seo descriptions, and FAQs
-- for all 3 projects.
-- Run this in Supabase → SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Mahalakshmi ───────────────────────────────────────────────────────────
UPDATE properties
SET
  slug             = 'mahalakshmi-2-3-bhk-apartments-for-sale-in-kumbakonam',
  "seoTitle"       = 'Premium 2 & 3 BHK Apartments in Melakaveri, Kumbakonam | Shivashree Developers',
  "seoDescription" = 'Premium 2 & 3 BHK apartments for sale in Melakaveri, Kumbakonam by Shivashree Developers. Enjoy modern amenities, peaceful surroundings, prime location, and excellent investment potential for homebuyers and Chennai investors.'
WHERE slug = 'shivashrees-mahalakshmi-swamimalai-kumbakonam';

DELETE FROM property_faqs
WHERE "propertyId" = (SELECT id FROM properties WHERE slug = 'mahalakshmi-2-3-bhk-apartments-for-sale-in-kumbakonam');

INSERT INTO property_faqs ("propertyId", question, answer, "sortOrder")
SELECT id, q.question, q.answer, q.sort
FROM properties,
(VALUES
  (0, 'Where is Shivashree Mahalakshmi located in Kumbakonam?',     'Shivashree Mahalakshmi is located in Swamimalai near Kumbakonam, a peaceful residential area with good connectivity and proximity to temples and essential facilities.'),
  (1, 'What types of apartments are available in Shivashree Mahalakshmi?', 'The project offers premium 2 and 3 BHK apartments with modern design, spacious layouts, and quality construction suitable for families and investors.'),
  (2, 'Is this project close to Swamimalai Temple?',                'Yes, the project is located near the famous Swamimalai Murugan Temple, one of the key spiritual landmarks near Kumbakonam.'),
  (3, 'Why invest in apartments in Swamimalai, Kumbakonam?',        'Swamimalai is a fast-developing residential area near Kumbakonam known for its peaceful environment, cultural importance, and strong real estate growth potential.'),
  (4, 'Are these apartments suitable for Chennai buyers?',          'Yes, Chennai buyers prefer investing in Swamimalai and Kumbakonam due to affordable pricing and high appreciation potential compared to metro cities.'),
  (5, 'What amenities are available in Shivashree Mahalakshmi apartments?', 'Amenities include car parking, security, power backup, water supply, and proximity to schools, hospitals, and transport facilities.')
) AS q(sort, question, answer)
WHERE properties.slug = 'mahalakshmi-2-3-bhk-apartments-for-sale-in-kumbakonam';


-- ── 2. Aishwaryam East ───────────────────────────────────────────────────────
UPDATE properties
SET
  slug             = 'aishwaryam-2-3-bhk-apartments-for-sale-in-kumbakonam',
  "seoTitle"       = 'Luxury 2 & 3 BHK Apartments for sale in Dabeer, Kumbakonam | Shivashree Developers',
  "seoDescription" = 'Explore luxury 2 & 3 BHK apartments for sale in Dabeer, Kumbakonam by Shivashree Developers. Premium living with modern amenities, prime location, excellent connectivity, and strong investment potential for homebuyers and Chennai investors.'
WHERE slug = 'shivashrees-aishwaryam-east-dabeer-kumbakonam';

DELETE FROM property_faqs
WHERE "propertyId" = (SELECT id FROM properties WHERE slug = 'aishwaryam-2-3-bhk-apartments-for-sale-in-kumbakonam');

INSERT INTO property_faqs ("propertyId", question, answer, "sortOrder")
SELECT id, q.question, q.answer, q.sort
FROM properties,
(VALUES
  (0, 'Where is Shivashree Aishwaryam East located in Kumbakonam?',   'Shivashree Aishwaryam East is located in Dabeer, Kumbakonam, a well-developed residential area with good connectivity and access to essential facilities.'),
  (1, 'What types of luxury apartments are available in this project?','The project offers luxury 2 and 3 BHK apartments in Kumbakonam with modern design, spacious layouts, and high-quality construction.'),
  (2, 'Why choose luxury apartments in Dabeer, Kumbakonam?',          'Dabeer is a prime residential area in Kumbakonam with strong infrastructure, good connectivity, and high demand, making it ideal for luxury living.'),
  (3, 'Is investing in luxury apartments in Kumbakonam a good option?','Yes, luxury apartments in Kumbakonam offer better resale value, premium lifestyle, and strong future growth potential.'),
  (4, 'Are these luxury apartments suitable for Chennai buyers?',      'Yes, Chennai buyers prefer investing in luxury apartments in Kumbakonam due to affordability and long-term appreciation potential.'),
  (5, 'What amenities are included in Shivashree Aishwaryam East?',   'Amenities include car parking, 24/7 security, power backup, water supply, and proximity to schools, hospitals, and transport facilities.')
) AS q(sort, question, answer)
WHERE properties.slug = 'aishwaryam-2-3-bhk-apartments-for-sale-in-kumbakonam';


-- ── 3. Syamala ───────────────────────────────────────────────────────────────
UPDATE properties
SET
  slug             = 'syamala-3-bhk-apartments-for-sale-in-chennai',
  "seoTitle"       = 'Luxury 2 & 3 BHK Apartments in Arumbakkam, Chennai | Shivashree Developers',
  "seoDescription" = 'Explore luxury 2 & 3 BHK apartments for sale in Arumbakkam, Chennai by Shivashree Developers. Premium homes with modern amenities, prime location, excellent connectivity, and high investment value.'
WHERE slug = 'shivashrees-syamala-arumbakkam-chennai';

DELETE FROM property_faqs
WHERE "propertyId" = (SELECT id FROM properties WHERE slug = 'syamala-3-bhk-apartments-for-sale-in-chennai');

INSERT INTO property_faqs ("propertyId", question, answer, "sortOrder")
SELECT id, q.question, q.answer, q.sort
FROM properties,
(VALUES
  (0, 'Where is Shivashree Syamala located in Chennai?',         'Shivashree Syamala is located in Arumbakkam, Chennai, a well-developed residential area with excellent connectivity to key locations.'),
  (1, 'What types of apartments are available in Shivashree Syamala?', 'The project offers luxury 2 and 3 BHK apartments in Arumbakkam with modern design, spacious layouts, and quality construction.'),
  (2, 'Why choose apartments in Arumbakkam, Chennai?',            'Arumbakkam is a prime residential area in Chennai with excellent connectivity, proximity to business hubs, and access to schools, hospitals, and transport.'),
  (3, 'Is buying an apartment in Arumbakkam a good investment?',  'Yes, Arumbakkam offers strong property appreciation, high rental demand, and a strategic location in Chennai, making it a smart investment.'),
  (4, 'Are these apartments suitable for families and professionals?', 'Yes, the apartments are ideal for families and working professionals due to modern amenities and convenient location.'),
  (5, 'What amenities are available in Shivashree Syamala apartments?', 'Amenities include car parking, 24/7 security, power backup, water supply, and proximity to schools, hospitals, and transport.')
) AS q(sort, question, answer)
WHERE properties.slug = 'syamala-3-bhk-apartments-for-sale-in-chennai';
