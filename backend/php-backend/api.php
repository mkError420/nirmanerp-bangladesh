<?php
/**
 * api.php - Main API Entry Point for InfinityFree Hosting
 * NirmanERP Bangladesh Edition
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Autoload classes
spl_autoload_register(function ($class) {
    $prefix = 'NirmanERP\\';
    $base_dir = __DIR__ . '/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

use NirmanERP\Controllers\RAContractorController;
use NirmanERP\Controllers\ProcurementController;
use NirmanERP\Controllers\TaxAitController;

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($request_uri, PHP_URL_PATH);

// Route matching
try {
    // Health check
    if ($path === '/api/v1/health' && $request_method === 'GET') {
        echo json_encode([
            'success' => true,
            'data' => [
                'status' => 'OK',
                'system' => 'NirmanERP Bangladesh Edition REST API',
                'timestamp' => date('c')
            ],
            'message' => 'Server is healthy.'
        ]);
        exit;
    }
    
    // RA Bills endpoints
    if (preg_match('#^/api/v1/ra-bills$#', $path) && $request_method === 'GET') {
        $controller = new RAContractorController();
        $controller->listRABills();
        exit;
    }
    
    if (preg_match('#^/api/v1/ra-bills/approve$#', $path) && $request_method === 'POST') {
        $controller = new RAContractorController();
        $controller->approveRABill();
        exit;
    }
    
    // Procurement endpoints
    if (preg_match('#^/api/v1/procurement/grn$#', $path) && $request_method === 'POST') {
        $controller = new ProcurementController();
        $controller->receiveGRNAndPostStock();
        exit;
    }
    
    if (preg_match('#^/api/v1/store/stock$#', $path) && $request_method === 'GET') {
        $controller = new ProcurementController();
        $controller->getStockLedger();
        exit;
    }
    
    // Tax/AIT endpoints
    if (preg_match('#^/api/v1/tax/ait$#', $path) && $request_method === 'POST') {
        $controller = new TaxAitController();
        $controller->calculateAIT();
        exit;
    }
    
    // 404 for unknown routes
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Endpoint not found',
        'path' => $path
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
