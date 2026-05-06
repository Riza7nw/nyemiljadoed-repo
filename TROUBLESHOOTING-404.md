# 404 Not Found — solusi cepat (Laragon)

## 1. Pastikan project ada di folder **www** Laragon

Contoh path yang benar:

`C:\laragon\www\webnyemil\`

Di dalamnya harus ada `index.html`, `subscribe.php`, `ping.php`, dll.

Kalau project masih di `D:\webnyemiljadoel\` **tanpa** disalin ke `www`, Apache tidak akan menemukan file → **404**.

**Solusi:** Salin/cut folder project ke `C:\laragon\www\webnyemil\` (nama folder boleh beda, sesuaikan URL).

---

## 2. URL yang dipakai harus lewat Laragon (bukan port 3000)

| Salah | Benar |
|--------|--------|
| `http://127.0.0.1:3000/...` (Live Server) | `http://localhost/webnyemil/` atau `http://webnyemil.test/` |
| Buka file `.html` langsung dari Explorer | Buka lewat browser dengan alamat `http://...` di atas |

---

## 3. Cek apakah PHP & path sudah benar

Setelah project di `www`, buka di browser:

`http://localhost/webnyemil/ping.php`  
*(ganti `webnyemil` dengan nama folder kamu di `www`)*

- **Tampil JSON** `"PHP jalan..."` → path & PHP **OK**. Lalu tes: `http://localhost/webnyemil/subscribe.php` (boleh error method, yang penting **bukan 404**).
- **Masih 404** → nama folder di URL salah, atau file belum di `www`.

---

## 4. Cek nama folder di URL

Kalau folder kamu `webnyemiljadoel`, URL-nya:

`http://localhost/webnyemiljadoel/`

Harus **sama persis** dengan nama folder di `C:\laragon\www\`.

---

## 5. Start Laragon

Tray Laragon → **Start All** (Apache + MySQL hijau).

---

## Ringkas

404 = server **tidak menemukan file** di path itu.  
Perbaiki dengan: **file di `laragon\www\` + URL `http://localhost/NAMA_FOLDER/...`** + **jangan pakai port 3000** untuk PHP.
