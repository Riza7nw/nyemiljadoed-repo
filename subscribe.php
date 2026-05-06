<?php
/**
 * Endpoint penyimpanan email newsletter ke MySQL (database: nyemil).
 * Method: POST, Content-Type: application/json
 * Body: { "email": "user@example.com" }
 */

ob_start();

/**
 * Selalu keluarkan JSON bersih (tanpa whitespace/BOM/notifikasi PHP di depan body).
 */
function nyemil_json(int $httpCode, array $payload): void
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Validasi email: pakai filter standar, kalau gagal pakai pola longgar (domain apa saja).
 */
function nyemil_validate_email(string $raw): ?string
{
    $raw = trim($raw);
    if ($raw === '') {
        return null;
    }
    if (function_exists('mb_strlen') && mb_strlen($raw) > 255) {
        return null;
    }

    $filtered = filter_var($raw, FILTER_VALIDATE_EMAIL);
    if ($filtered !== false) {
        return $filtered;
    }

    // Pola sangat longgar: minimal bentuk user@domain.tld (banyak provider & format)
    if (preg_match('/^[^\s@]{1,64}@[^\s@]{1,255}$/u', $raw) && strpos($raw, '.') !== false) {
        return $raw;
    }

    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    nyemil_json(405, ['ok' => false, 'message' => 'Method tidak diizinkan']);
}

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    nyemil_json(500, [
        'ok' => false,
        'message' => 'Server belum dikonfigurasi. Salin config.example.php menjadi config.php dan isi kredensial MySQL.',
    ]);
}

$config = require $configPath;

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$rawEmail = isset($data['email']) ? (string) $data['email'] : '';
$email = nyemil_validate_email($rawEmail);

if ($email === null) {
    nyemil_json(400, ['ok' => false, 'message' => 'Format email belum benar. Contoh: nama@gmail.com']);
}

// Hindari duplikat beda huruf besar/kecil
$email = strtolower($email);

$host = $config['db_host'] ?? 'localhost';
$name = $config['db_name'] ?? 'nyemil';
$user = $config['db_user'] ?? 'root';
$pass = $config['db_pass'] ?? '';
$charset = $config['db_charset'] ?? 'utf8mb4';

$dsn = "mysql:host={$host};dbname={$name};charset={$charset}";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $stmt = $pdo->prepare(
        'INSERT INTO newsletter_subscribers (email) VALUES (:email)'
    );
    $stmt->execute(['email' => $email]);

    nyemil_json(200, [
        'ok' => true,
        'message' => 'Terima kasih! Email kamu sudah tersimpan. Nantikan promo rahasia tiap minggu.',
    ]);
} catch (PDOException $e) {
    // Duplikat email (MySQL error 1062)
    $mysqlErr = isset($e->errorInfo[1]) ? (int) $e->errorInfo[1] : 0;
    if ($mysqlErr === 1062) {
        nyemil_json(200, [
            'ok' => true,
            'message' => 'Email ini sudah terdaftar. Kamu tetap dapat promo seperti biasa.',
        ]);
    }

    $debug = !empty($config['debug']);
    $hint = 'Pastikan MySQL jalan, database `nyemil` & tabel `newsletter_subscribers` sudah diimpor (file nyemil.sql), dan config.php benar.';
    if ($mysqlErr === 1049) {
        $hint = 'Database `nyemil` belum dibuat. Jalankan/import file nyemil.sql di phpMyAdmin.';
    } elseif ($mysqlErr === 1146) {
        $hint = 'Tabel `newsletter_subscribers` belum ada. Import ulang file nyemil.sql.';
    } elseif ($mysqlErr === 1045) {
        $hint = 'User/password MySQL salah di config.php.';
    }

    $message = 'Gagal menyimpan ke database. ' . $hint;
    if ($debug) {
        $message .= ' [Detail: ' . $e->getMessage() . ']';
    }

    nyemil_json(500, [
        'ok' => false,
        'message' => $message,
    ]);
}
