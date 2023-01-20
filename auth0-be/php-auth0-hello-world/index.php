<?php
require 'vendor/autoload.php';
use Cumulio\Cumulio;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Token;
// use Auth0\SDK\Helpers\JWKFetcher;
use Auth0\SDK\Token\Verifier;

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
$configuration = new SdkConfiguration(
  strategy: SdkConfiguration::STRATEGY_API,
  domain: 'https://'.$_ENV['AUTH_DOMAIN'].'/',
  audience: array($_ENV['AUTH_AUDIENCE']),
  clientId: $_ENV['AUTH_CLIENT_ID']
);

$auth0 = new Auth0($configuration);

$client = Cumulio::initialize($_ENV['CUMUL_KEY'], $_ENV['CUMUL_TOKEN'], $_ENV['API_URL']);
$queries = array();

$headers = getallheaders();
$token = $headers['Authorization'];

$jwtToken = explode(' ', $token)[1];


$decodedToken = $auth0->decode($jwtToken)->toArray();
$data = json_decode(file_get_contents('php://input'), true);

$data = array(
  'integration_id' => $_ENV['INTEGRATION_ID'],
  'type' => 'sso',
  'expiry' => '24 hours',
  'inactivity_interval' => '10 minutes',
  'username' => $data['username'] ?? $_ENV['USER_USERNAME'],
  'name' => $data['name'] ?? $_ENV['USER_NAME'],
  'email' => $data['email'] ?? $_ENV['USER_EMAIL'],
  'suborganization' => $data['suborganization'] ?? $_ENV['USER_SUBORGANIZATION'],
  'role' => 'viewer',
  'metadata' => array(
    'brand' => array($decodedToken['https://cumulio/brand'])
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