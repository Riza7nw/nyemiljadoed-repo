# Email promo → MySQL (`nyemil`)

## Alur

1. User isi email di bagian promo → klik **Kirim Sekarang**.
2. `subscribe.php` menyimpan ke database **`nyemil`**, tabel **`newsletter_subscribers`**.
3. **Import dulu** `nyemil.sql` di phpMyAdmin (atau MySQL CLI) supaya database & tabel ada.

## Yang wajib

- **Apache + MySQL** menyala (XAMPP, Laragon, WAMP, dll.).
- **`config.php`**: isi user & password MySQL (salin dari `config.example.php`).
- Buka situs lewat **`http://localhost/...`** (bukan `file:///` dan bukan Live Server saja).

## Cek data

phpMyAdmin → database **`nyemil`** → tabel **`newsletter_subscribers`** → kolom `email`, `created_at`.

## Import

Di phpMyAdmin: tab **Import** → pilih **`nyemil.sql`** → jalankan.

## Query SQL lengkap (Laragon / phpMyAdmin)

Lihat file **`query-sql-promo-laragon.sql`**: berisi query buat database/tabel, contoh **INSERT** (sama seperti saat user klik Kirim Sekarang), dan **SELECT** untuk melihat data.

## Error 404?

Baca **`TROUBLESHOOTING-404.md`**. Cepatnya: project harus di **`C:\laragon\www\...`**, buka `http://localhost/NAMA_FOLDER/ping.php` (bukan port 3000).
