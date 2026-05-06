-- =============================================================================
-- QUERY SQL — Email promo "Kirim Sekarang" → database phpMyAdmin (Laragon)
-- Database: nyemil | Tabel: newsletter_subscribers
-- =============================================================================
-- Cara pakai di Laragon:
--   1. Start Laragon (Apache + MySQL)
--   2. Buka phpMyAdmin: http://localhost/phpmyadmin (atau dari menu Laragon)
--   3. Tab "SQL" — tempel query di bawah (jalankan per blok / sekali jalan)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- A) SATU KALI: buat database + tabel (sama isinya dengan file nyemil.sql)
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `nyemil`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `nyemil`;

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- B) INI QUERY YANG SETARA DENGAN TOMBOL "Kirim Sekarang" (isi dari website)
--    Saat user kirim email, subscribe.php menjalankan INSERT seperti ini:
--    (ganti email di bawah untuk uji manual di phpMyAdmin)
-- -----------------------------------------------------------------------------
INSERT INTO `newsletter_subscribers` (`email`)
VALUES ('contoh@gmail.com');

-- Versi aman jika email sama tidak boleh dobel (abaikan jika sudah ada):
-- INSERT IGNORE INTO `newsletter_subscribers` (`email`) VALUES ('contoh@gmail.com');

-- -----------------------------------------------------------------------------
-- C) CEK DATA yang sudah masuk (buka tab SQL atau klik Browse di tabel)
-- -----------------------------------------------------------------------------
SELECT `id`, `email`, `created_at`
FROM `newsletter_subscribers`
ORDER BY `created_at` DESC;

-- -----------------------------------------------------------------------------
-- D) HAPUS satu baris (opsional, untuk bersihkan tes)
-- -----------------------------------------------------------------------------
-- DELETE FROM `newsletter_subscribers` WHERE `email` = 'contoh@gmail.com';

-- -----------------------------------------------------------------------------
-- Catatan:
-- - Website memakai prepared statement: INSERT ... VALUES (:email)
-- - Email disimpan huruf kecil (contoh@gmail.com)
-- - Email yang sama 2x akan ditolak UNIQUE — di website ditampilkan pesan "sudah terdaftar"
-- =============================================================================
