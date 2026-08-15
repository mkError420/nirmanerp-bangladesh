<?php
/**
 * AuthMiddleware.php - JWT Authentication Middleware
 * NirmanERP Bangladesh Edition
 */

namespace NirmanERP\Middleware;

class AuthMiddleware {
    private static string $jwt_secret = "NIRMAN_ERP_BD_SUPER_SECRET_KEY_2026";

    /**
     * Validate JWT Token from Bearer Header
     */
    public static function authenticate(): array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Unauthorized access. Bearer token missing."
            ]);
            exit;
        }

        $jwt = $matches[1];
        $tokenParts = explode('.', $jwt);

        if (count($tokenParts) !== 3) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid JWT token structure."
            ]);
            exit;
        }

        $header = json_decode(base64_decode($tokenParts[0]), true);
        $payload = json_decode(base64_decode($tokenParts[1]), true);
        $signature_provided = $tokenParts[2];

        // Verify signature
        $base64UrlHeader = self::base64UrlEncode(json_encode($header));
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$jwt_secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        if ($base64UrlSignature !== $signature_provided) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid token signature."
            ]);
            exit;
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Token has expired."
            ]);
            exit;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
}
