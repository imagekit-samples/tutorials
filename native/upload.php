<?php

ini_set('display_errors', 1);

/**
 * PHP returns an appropriate error code along with the file array. 
 * This array is used to map the error code to a human-readable message.
 * @see https://www.php.net/manual/en/features.file-upload.errors.php
 */
define(
    'PHP_UPLOAD_ERROR_MESSAGES',
    array(
        UPLOAD_ERR_OK => 'There is no error, the file uploaded with success', // UPLOAD_ERR_OK = 0
        UPLOAD_ERR_INI_SIZE => 'The uploaded file exceeds the upload_max_filesize directive in php.ini', // UPLOAD_ERR_INI_SIZE = 1
        UPLOAD_ERR_FORM_SIZE => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form', // UPLOAD_ERR_FORM_SIZE = 2
        UPLOAD_ERR_PARTIAL => 'The uploaded file was only partially uploaded', // UPLOAD_ERR_PARTIAL = 3
        UPLOAD_ERR_NO_FILE => 'No file was uploaded', // UPLOAD_ERR_NO_FILE = 4
        UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder', // UPLOAD_ERR_NO_TMP_DIR = 6
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.', // UPLOAD_ERR_CANT_WRITE = 7
        UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload.', // UPLOAD_ERR_EXTENSION = 8
    )
);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit;
}

$UPLOAD_DESTINATION = './uploads/';

if (isset ($_FILES["file"]) && !empty ($_FILES["file"])) {

    $file = $_FILES["file"];

    if ($file["error"] !== UPLOAD_ERR_OK) {
        header('HTTP/1.1 400 Bad Request');
        echo PHP_UPLOAD_ERROR_MESSAGES[$file["error"]];
        exit;
    }

    $error = move_uploaded_file($file["tmp_name"], $UPLOAD_DESTINATION . $file["name"]);

    if ($error) {
        echo 'Uploaded';
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo 'Failed to move file';
    }

} else {
    header('HTTP/1.1 400 Bad Request');
}

