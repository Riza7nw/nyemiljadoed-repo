<?php
/**
 * Uji cepat: kalau file ini bisa dibuka di browser, PHP + path Laragon sudah benar.
 * Buka: http://localhost/NAMA_FOLDER/ping.php  atau  http://nama-folder.test/ping.php
 */
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'ok' => true,
    'message' => 'PHP jalan. Folder & URL sudah benar.',
    'time' => date('c'),
]);
