-- =============================================================
-- Barangay Zone 2 Ordinance Archive — Database Schema
-- MySQL 8.0+
-- =============================================================

CREATE DATABASE IF NOT EXISTS barangay_archive
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barangay_archive;

-- -------------------------------------------------------------
-- ordinances
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ordinances (
  id               INT            AUTO_INCREMENT PRIMARY KEY,
  ordinance_number VARCHAR(60)    NOT NULL,
  title            VARCHAR(600)   NOT NULL,
  description      TEXT           DEFAULT NULL,
  full_text        LONGTEXT       DEFAULT NULL,
  date_passed      DATE           NOT NULL,
  category         VARCHAR(100)   NOT NULL DEFAULT 'General',
  status           ENUM('active','archived') NOT NULL DEFAULT 'active',
  file_url         VARCHAR(1200)  DEFAULT NULL,
  file_name        VARCHAR(300)   DEFAULT NULL,
  file_type        VARCHAR(100)   DEFAULT NULL,
  gcs_path         VARCHAR(1200)  DEFAULT NULL,
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE  KEY uq_ordinance_number (ordinance_number),
  INDEX   idx_date_passed          (date_passed),
  INDEX   idx_category             (category),
  INDEX   idx_status               (status),
  FULLTEXT INDEX ft_ordinances     (title, description, full_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- officials
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officials (
  id             INT            AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(255)   NOT NULL,
  position       VARCHAR(255)   NOT NULL,
  committee      VARCHAR(300)   DEFAULT NULL,
  email          VARCHAR(255)   DEFAULT NULL,
  phone          VARCHAR(60)    DEFAULT NULL,
  photo_url      VARCHAR(1200)  DEFAULT NULL,
  photo_gcs_path VARCHAR(1200)  DEFAULT NULL,
  term_start     YEAR           DEFAULT NULL,
  term_end       YEAR           DEFAULT NULL,
  sort_order     INT            NOT NULL DEFAULT 0,
  is_active      TINYINT(1)     NOT NULL DEFAULT 1,
  created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_position   (position),
  INDEX idx_sort_order (sort_order),
  INDEX idx_is_active  (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SEED DATA — Sample Ordinances
-- =============================================================
INSERT INTO ordinances
  (ordinance_number, title, description, date_passed, category)
VALUES
  (
    'ORD-2024-001',
    'An Ordinance Establishing the Barangay Zone 2 Solid Waste Management Program',
    'This ordinance establishes a comprehensive solid waste management program for Barangay Zone 2, promoting environmental sustainability and community cleanliness through segregation at source, composting, and scheduled collection.',
    '2024-01-15',
    'Environment'
  ),
  (
    'ORD-2024-002',
    'An Ordinance Regulating the Operation of Food Establishments within Barangay Zone 2',
    'This ordinance sets the standards and regulations for food establishments operating within the barangay to ensure food safety, sanitation, and public health protection.',
    '2024-02-20',
    'Health & Sanitation'
  ),
  (
    'ORD-2024-003',
    'An Ordinance Establishing a Barangay Scholarship Program for Deserving Students',
    'This ordinance establishes a scholarship program to support academically deserving students from low-income families within Barangay Zone 2, providing financial assistance for tuition, school supplies, and living allowance.',
    '2024-03-10',
    'Education'
  ),
  (
    'ORD-2024-004',
    'An Ordinance Prohibiting the Burning of Garbage within Barangay Zone 2',
    'This ordinance prohibits open burning of solid waste and garbage within the territorial jurisdiction of Barangay Zone 2 to protect the health of residents and improve air quality.',
    '2024-04-05',
    'Environment'
  ),
  (
    'ORD-2023-015',
    'An Ordinance Imposing Curfew Hours for Minors within Barangay Zone 2',
    'This ordinance imposes curfew hours for minors below eighteen (18) years of age to ensure their safety and welfare within the barangay and to prevent juvenile delinquency.',
    '2023-11-05',
    'Peace & Order'
  ),
  (
    'ORD-2023-012',
    'An Ordinance Establishing a Barangay Health Center and Regular Medical Mission Program',
    'This ordinance establishes a permanent barangay health center and authorizes the conduct of quarterly medical missions to provide free basic health services to all residents.',
    '2023-09-15',
    'Health & Sanitation'
  ),
  (
    'ORD-2023-008',
    'An Ordinance Appropriating Funds for Barangay Infrastructure Improvement Projects',
    'This ordinance appropriates funds from the barangay general fund for the repair and improvement of roads, drainage systems, and community facilities within Barangay Zone 2.',
    '2023-07-22',
    'Infrastructure'
  ),
  (
    'ORD-2023-003',
    'An Ordinance Creating the Barangay Livelihood and Skills Training Program',
    'This ordinance creates a livelihood and skills training program aimed at providing residents with practical skills and additional sources of income to alleviate poverty and promote economic growth.',
    '2023-03-18',
    'Social Services'
  );

-- =============================================================
-- SEED DATA — Sample Officials
-- =============================================================
INSERT INTO officials
  (name, position, committee, email, phone, term_start, term_end, sort_order)
VALUES
  ('Hon. Maria Santos',    'Punong Barangay', NULL,                                   'punong@zone2.gov.ph',     '09XX-XXX-0001', 2023, 2026, 1),
  ('Hon. Juan dela Cruz',  'Barangay Kagawad','Committee on Peace and Order',          'kagawad1@zone2.gov.ph',   '09XX-XXX-0002', 2023, 2026, 2),
  ('Hon. Ana Reyes',       'Barangay Kagawad','Committee on Health and Sanitation',    'kagawad2@zone2.gov.ph',   '09XX-XXX-0003', 2023, 2026, 3),
  ('Hon. Pedro Gonzales',  'Barangay Kagawad','Committee on Education',                'kagawad3@zone2.gov.ph',   '09XX-XXX-0004', 2023, 2026, 4),
  ('Hon. Rosa Villanueva', 'Barangay Kagawad','Committee on Environment',              'kagawad4@zone2.gov.ph',   '09XX-XXX-0005', 2023, 2026, 5),
  ('Hon. Miguel Torres',   'Barangay Kagawad','Committee on Infrastructure',           'kagawad5@zone2.gov.ph',   '09XX-XXX-0006', 2023, 2026, 6),
  ('Hon. Liza Mendoza',    'Barangay Kagawad','Committee on Social Services',          'kagawad6@zone2.gov.ph',   '09XX-XXX-0007', 2023, 2026, 7),
  ('Hon. Carlos Bautista', 'Barangay Kagawad','Committee on Finance and Appropriation','kagawad7@zone2.gov.ph',   '09XX-XXX-0008', 2023, 2026, 8),
  ('SK. Sofia Aquino',     'SK Chairperson',  'Sangguniang Kabataan',                  'sk@zone2.gov.ph',         '09XX-XXX-0009', 2023, 2026, 9),
  ('Mr. Roberto Cruz',     'Barangay Secretary',NULL,                                  'secretary@zone2.gov.ph',  '09XX-XXX-0010', 2023, 2026, 10),
  ('Ms. Elena Santos',     'Barangay Treasurer',NULL,                                  'treasurer@zone2.gov.ph',  '09XX-XXX-0011', 2023, 2026, 11);
