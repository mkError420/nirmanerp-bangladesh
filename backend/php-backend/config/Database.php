<?php
/**
 * Database.php - PDO Database Singleton Connection with Transaction Support
 * NirmanERP Bangladesh Edition
 */

namespace NirmanERP\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private string $charset;

    private function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? 'sql107.infinityfree.com';
        $this->db_name = $_ENV['DB_NAME'] ?? 'if0_42333746_mk_pos';
        $this->username = $_ENV['DB_USER'] ?? 'if0_42333746';
        $this->password = $_ENV['DB_PASS'] ?? 'VHxnlDleyPf09';
        $this->charset = 'utf8mb4';
    }

    /**
     * Get Singleton PDO Instance
     */
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $config = new self();
            $dsn = "mysql:host={$config->host};dbname={$config->db_name};charset={$config->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            try {
                self::$instance = new PDO($dsn, $config->username, $config->password, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Database Connection Failed: " . $e->getMessage()
                ]);
                exit;
            }
        }
        return self::$instance;
    }

    /**
     * Execute callback inside a PDO Transaction safely
     */
    public static function transaction(callable $callback) {
        $db = self::getInstance();
        $db->beginTransaction();
        try {
            $result = $callback($db);
            $db->commit();
            return $result;
        } catch (\Throwable $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            throw $e;
        }
    }
}
