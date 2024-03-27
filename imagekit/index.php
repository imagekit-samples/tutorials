<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet">
  <title>Upload Files</title>
  <style>
    /* Add styles here */
    * {
      box-sizing: border-box;
      font-family: "Montserrat", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }

    @-webkit-keyframes rotate {
      from {
        -webkit-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
      }

      to {
        -webkit-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes rotate {
      from {
        -ms-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
      }

      to {
        -ms-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }


    body {
      margin: 0;
      padding: 1rem;
      background-color: #0679e4;
    }

    .upload-form {
      display: flex;
      max-width: 30vw;
      padding: 20px;
      flex-flow: column;
      margin: 100px auto 1rem auto;
      background-color: #fff;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
    }

    .upload-form h1 {
      margin: 0;
      padding: 1rem 0px 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #434850;
      text-align: left;
    }

    .upload-form label {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      border: 1px dashed #e6e8ec;
      color: #000000;
      padding: 0.5rem 0.75rem;
      font-weight: 500;
      font-size: 0.875rem;
      margin: 0.5rem 0;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    .upload-form label i {
      padding: 0.25rem 0;
      color: #0c7ce5;
    }

    .upload-form label span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      word-break: break-all;
    }

    .upload-form label:hover {
      background-color: #f7f8f9;
      border: 1px dashed #e3e5ea;
    }

    .upload-form input[type="file"] {
      appearance: none;
      visibility: hidden;
      height: 0;
      width: 0;
      padding: 0;
      margin: 0;
    }

    .upload-form .result {
      display: flex;
      background: #ecf6ff;
      border-radius: 0.25rem;
      gap: 0.5rem;
      padding: 0.5rem
    }

    .upload-form .result * {
      font-size: 0.5rem;
    }

    .upload-form .result .ph-file {
      font-size: 1.5rem;
    }

    .upload-form .result span {
      display: block;
    }

    .upload-form .result .file-details {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0.25rem;
      flex: 1
    }

    .upload-form .result .file-details span.file-name {
      color: #000000;
      font-weight: 600;
    }

    .upload-form .result .file-details span.file-size {
      color: #a0aeba;
    }

    .upload-form .result .progress-bar {
      width: 100%;
      height: 0.25rem;
      background-color: #e3e5ea;
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .upload-form .result .progress-bar .progress {
      height: 100%;
      background-color: #0c7ce5;
    }

    .upload-form .result .upload-result {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.25rem;
    }

    .upload-form .result .upload-result .ph-circle-notch {
      -webkit-animation: rotate 2s linear infinite;
      -moz-animation: rotate 2s linear infinite;
      -ms-animation: rotate 2s linear infinite;
      -o-animation: rotate 2s linear infinite;
      animation: rotate 2s linear infinite;
      font-size: 1rem;
    }

    .upload-form .result .upload-result .ph-check-circle {
      color: #23c925;
      font-size: 1rem;
    }

    .upload-form .result .upload-result .ph-x-circle {
      color: #c94647;
      font-size: 1rem;
    }
  </style>
</head>

<body>
  <form class="upload-form" action="upload.php" method="post" enctype="multipart/form-data">

    <h1>Upload File</h1>

    <label for="file">
      <i class="ph ph-upload"></i>

      <span>
        Drag & drop or <span style="color: #0c7ce5; display: inline-block; margin: 0px 2px;">browse</span> your files
      </span>
    </label>


    <input id="file" type="file" name="file">

    <div class="result" style="display: none;">
      <i class="ph ph-file"></i>
      <div class="file-details">
        <span class="file-name"></span>
        <div class="progress-bar">
          <div class="progress" style="width: 0%"></div>
        </div>
        <span class="file-size"></span>
      </div>

      <div class="upload-result"></div>
    </div>

  </form>

  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  <script type="text/javascript" src="https://unpkg.com/imagekit-javascript/dist/imagekit.min.js"></script>
  <script type="text/javascript">
    /* Add JavaScript here */

    const imagekit = new ImageKit({
      publicKey: '<?php echo $_ENV["PUBLIC_KEY"]; ?>',
      urlEndpoint: '<?php echo $_ENV["URL_ENDPOINT"]; ?>',
    });

    const form = document.querySelector('.upload-form');
    const fileInput = form.querySelector('input[type="file"]');
    const outputBox = form.querySelector('.result');

    form.addEventListener('dragover', function (event) {
      event.preventDefault();
    })

    form.addEventListener('drop', function (event) {
      event.preventDefault();
      if (event.dataTransfer.files.length) {
        uploadFile(event.dataTransfer.files[0]);
      }
    })

    function getToken(cb) {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "json";

      xhr.onload = function () {
        if (this.status === 200) {
          cb(null, this.response);
        } else {
          cb(new Error("Failed to get token"));
        }
      }

      xhr.onerror = function () {
        cb(new Error("Failed to get token"));
      }

      xhr.open("GET", "imagekit/imagekit-token.php");

      xhr.send();
    }

    // Upload file using ImageKit
    function uploadFile(file) {
      outputBox.querySelector('.file-name').textContent = file.name;
      outputBox.querySelector('.file-size').textContent = `${(file.size / 1024).toFixed(2)} KB`;

      outputBox.querySelector('.upload-result').innerHTML = `
          <i class="ph ph-circle-notch"></i>
        `;

      outputBox.style.display = 'flex';

      getToken(function (err, token) {
        if (err) {
          console.log(err);
          outputBox.querySelector('.upload-result').innerHTML = `
                  <i class="ph ph-x-circle"></i>
              `;
          return
        }

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", function (event) {
          const progress = (event.loaded / event.total) * 100;
          outputBox.querySelector('.progress').style.width = `${progress}%`;
        });

        imagekit.upload({
          xhr,
          file: file,
          fileName: file.name,
          token: token.token,
          signature: token.signature,
          expire: token.expire,
          useUniqueFileName: false,
          folder: "/php-upload"
        }, function (err, result) {
          if (err) {
            console.log(err);
            outputBox.querySelector('.upload-result').innerHTML = `
                      <i class="ph ph-x-circle"></i>
                  `;
          } else {
            console.log(result)
            outputBox.querySelector('.upload-result').innerHTML = `
                  <i class="ph ph-check-circle"></i>
                  `;
          }
        });
      });
    }

    fileInput.addEventListener('change', function () {
      const file = fileInput.files?.[0];

      if (file) {
        uploadFile(file);
      } else {
        outputBox.textContent = 'No file selected';
      }

      form.reset();
    });

  </script>

</body>

</html>