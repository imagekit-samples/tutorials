<?php

require_once('vendor/autoload.php');

use ImageKit\ImageKit;

$imageKit = new ImageKit(
    "YOUR_PUBLIC_KEY",
    "YOUR_PRIVATE_KEY",
    "YOUR_URL_ENDPOINT"
);

header('Content-Type: application/json');
echo json_encode($imageKit->getAuthenticationParameters($token="", $expire = time() + 60));