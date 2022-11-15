<?php
require 'vendor/autoload.php';
use Cumulio\Cumulio;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
header('Content-Type: application/json');
header("HTTP/1.1 200 OK");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$client = Cumulio::initialize($_ENV['CUMUL_KEY'], $_ENV['CUMUL_TOKEN'], $_ENV['API_URL']);
$queries = array();
parse_str($_SERVER['QUERY_STRING'], $queries);
// $decoded = JWT::decode($queries['token'], new Key($key, 'HS256'));
// then use the decoded values as input

$data = array(
  'integration_id' => $_ENV['INTEGRATION_ID'],
  'type' => 'sso',
  'expiry' => '24 hours',
  'inactivity_interval' => '10 minutes',
  'username' => $queries['username'] ?? $_ENV['USER_USERNAME'],
  'name' => $queries['name'] ?? $_ENV['USER_NAME'],
  'email' => $queries['email'] ?? $_ENV['USER_EMAIL'],
  'suborganization' => $_ENV['USER_SUBORGANIZATION'],
  'role' => 'viewer',
  'metadata' => array(
    'brand' => $queries['brand']
  )
);

$authorization = $client->create('authorization', $data);


$authResponse = array(
  'status' => 'success',
  'key' => $authorization['id'],
  'token' => $authorization['token']
);

echo json_encode($authResponse, JSON_PRETTY_PRINT)
?>