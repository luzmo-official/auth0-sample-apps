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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
  return 0;    
} 

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$client = Cumulio::initialize($_ENV['CUMUL_KEY'], $_ENV['CUMUL_TOKEN'], $_ENV['API_URL']);
$queries = array();

$headers = getallheaders();
$token = $headers['Authorization'];
$jwtToken = explode(' ', $token)[1];

// $decodedToken = JWT::decode($token);
[, $payload_b64] = explode('.', $jwtToken);
$decodedToken = (array)JWT::jsonDecode(JWT::urlsafeB64Decode($payload_b64));
// then use the decoded values as input
$data = array(
  'integration_id' => $_ENV['INTEGRATION_ID'],
  'type' => 'sso',
  'expiry' => '24 hours',
  'inactivity_interval' => '10 minutes',
  'username' => $decodedToken['name'] ?? $_ENV['USER_USERNAME'],
  'name' => $decodedToken['name'] ?? $_ENV['USER_NAME'],
  'email' => $decodedToken['email'] ?? $_ENV['USER_EMAIL'],
  'suborganization' => $_ENV['USER_SUBORGANIZATION'],
  'role' => 'viewer',
  'metadata' => array(
    'brand' => $decodedToken['https://cumulio/brand']
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