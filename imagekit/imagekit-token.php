<?php

require_once('vendor/autoload.php');

use ImageKit\ImageKit;

$imageKit = new ImageKit(
    $_ENV['PUBLIC_KEY'],
    $_ENV['PRIVATE_KEY'],
    $_ENV['URL_ENDPOINT']
);

header('Content-Type: application/json');
echo json_encode($imageKit->getAuthenticationParameters($token="", $expire = time() + 60));