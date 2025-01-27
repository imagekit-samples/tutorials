'use client';

import { ImageKitProvider, IKUpload } from "imagekitio-next";
import styles from "../page.module.css";
import { useState, useEffect, useRef, useCallback } from "react";


export default function ImageKitUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFileValid, setIsFileValid] = useState(true)
const [fileValidationError, setFileValidationError] = useState(undefined)
  const ikUploadRef = useRef(null)

  const uploadViaIkSdk = useCallback((files) => {
    if (ikUploadRef?.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'files').set;
      nativeInputValueSetter.call(ikUploadRef.current, files);
      const changeEvent = new Event('change', { bubbles: true });
      ikUploadRef.current.dispatchEvent(changeEvent);
    }
  }, [ikUploadRef])

  useEffect(() => {
    const handlePaste = (e) => {
      e.preventDefault();
      const files = e.clipboardData?.files;
      
      if (!files || files.length === 0) return;

      uploadViaIkSdk(files)
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth");
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onError = (err) => {
    console.log('Error');
    console.log(err);
    alert("File could not be uploaded!")
    setUploadProgress(0)
  };
  
  const onProgress = (e) => {
    console.log(e)
    if (e.lengthComputable) {
      const progress = (e.loaded / e.total) * 100;
      setUploadProgress(progress);
    }
  };

  const onSuccess = (res) => {
    console.log('Success');
    console.log(res);
    setUploadProgress(0)
    alert("File uploaded successfully")
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    uploadViaIkSdk(e.dataTransfer.files)
  };

  // code to run the validations
  const validateFile = (file) => {
    if (file?.size > 5 * 1024 * 1024) {
      setIsFileValid(false)
      setFileValidationError("File must be less than 5MB in size.")
      return false
    }
    if (!file?.type?.startsWith("image/") && !file?.type?.startsWith("video/")) {
      setIsFileValid(false)
      setFileValidationError("File must be an image or a video.")
      return false
    }
    setIsFileValid(true)
    setFileValidationError(undefined)
    return true
  }

  // show an alert if validation fails
  useEffect(() => {
    if (!isFileValid) {
      alert(fileValidationError ?? "File is not valid. Please make sure it is an image or a video, and less than 5MB in size.")
      setIsFileValid(true)
      setFileValidationError(undefined)
    }
  }, [isFileValid, fileValidationError])

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
      authenticator={authenticator} 
    >
      <IKUpload
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onProgress}
        ref={ikUploadRef}
        style={{visibility: 'hidden', height: 0, width: 0}} // hide the default button
        validateFile={validateFile}
      />
      <div 
        className={styles.page}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadProgress > 0 && (
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        {ikUploadRef && (
          <>
            {isDragging && (
              <div className={styles.dropZone}>
                <div className={styles.dropZoneContent}>
                  Drop your file here
                </div>
              </div>
            )}
            <main className={styles.main}>
              <div className={styles.uploadArea}>
                <p className={styles.uploadText}>
                  Drag and drop your file here<br />
                  <span>or</span>
                </p>
                <p className={styles.uploadHint}>
                  You can also paste files using Ctrl+V / Cmd+V
                </p>
                <label className={styles.fileInputLabel}>
                  <input 
                    type="file" 
                    onChange={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      uploadViaIkSdk(e.target.files)
                    }}
                    className={styles.fileInput} 
                  />
                  Choose a file
                </label>
              </div>
            </main>
          </>
        )}
      </div>
    </ImageKitProvider>
  );
}