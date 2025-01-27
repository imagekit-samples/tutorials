'use client';

import styles from "../page.module.css";
import { useState, useEffect } from "react";

export default function NativeUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };

    xhr.onload = (obj) => {
      setUploadProgress(0);
      if (xhr.status === 200) {
        alert("File uploaded successfully!")
      } else {
        alert("File could not be uploaded!")
      }
    };

    xhr.onerror = () => {
      alert("File could not be uploaded!")
      setUploadProgress(0);
    };

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleUpload(file);
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

    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      e.preventDefault();
      const items = e.clipboardData?.items;
      
      if (!items) return;

      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          handleUpload(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
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
              onChange={handleFileInput}
              className={styles.fileInput} 
            />
            Choose a file
          </label>
        </div>
      </main>
    </div>
  );
}