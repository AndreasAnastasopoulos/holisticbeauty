<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow from specific origin - replace with your actual domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Log file setup
$logFile = __DIR__ . '/form_submissions.log';

function writeLog($message)
{
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

writeLog("Request received: " . $_SERVER['REQUEST_METHOD']);

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = file_get_contents('php://input');
        writeLog("Raw input: " . $input);

        $data = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON: ' . json_last_error_msg());
        }

        writeLog("Decoded data: " . print_r($data, true));

        // Validate only email as required
        if (empty($data['email'])) {
            throw new Exception('Email is required');
        }

        // Prepare data with optional fields
        $formData = [
            'email' => trim($data['email']),
            'name' => isset($data['name']) ? trim($data['name']) : '',
            'phone' => isset($data['phone']) ? trim($data['phone']) : ''
        ];

        // Your Google Apps Script URL
        $url = 'https://script.google.com/macros/s/AKfycbw-RgsZa5I4iVIHlJXdnes7kDSuRiWKR-iYd6yY9qu4UVfDenLLlDXdBgiPMKIvVwYSeA/exec';

        $ch = curl_init($url);
        $postData = http_build_query($formData);
        writeLog("Sending to Apps Script: " . $postData);

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        writeLog("Apps Script response (HTTP $httpCode): " . $response);

        if ($response === false) {
            throw new Exception('Curl error: ' . curl_error($ch));
        }

        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception("Apps Script returned HTTP code $httpCode");
        }

        echo json_encode([
            'success' => true,
            'message' => 'Η φόρμα υποβλήθηκε με επιτυχία',
            'response' => json_decode($response, true)
        ]);
    } catch (Exception $e) {
        writeLog("Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
