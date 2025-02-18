'use client';

import styles from "../page.module.css";
import { useState, useEffect } from "react";

export default function NativeUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadStats, setUploadStats] = useState({ loaded: 0, total: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetUpload = () => {
    setUploadProgress(0);
    setUploadStatus(null);
    setIsUploading(false);
  };

  // modified upload handler
  const handleUpload = (file) => {
    if (!file) return;
 
    const formData = new FormData();
    formData.append('file', file);
 
    const xhr = new XMLHttpRequest();
    
    setIsUploading(true);
    setUploadStatus(null);
    
    // new event callback
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
        setUploadStats({
          loaded: event.loaded,
          total: event.total
        });
      }
    };

    // set the upload progress to 0 after request completion
    xhr.onload = (obj) => {
      setIsUploading(false);
      if (xhr.status === 200) {
        setUploadStatus('success');
        setUploadProgress(100);
      } else {
        setUploadStatus('error');
        setUploadProgress(0);
      }
    };

    // set the upload progress to 0 after request failure too
    xhr.onerror = () => {
      setUploadStatus('error');
      setUploadProgress(0);
      setIsUploading(false);
    };

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    return `${(bytes / k).toFixed(1)} KB`;
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
      {isDragging && !isUploading && (
        <div className={styles.dropZone}>
          <div className={styles.dropZoneContent}>
            Drop your file here
          </div>
        </div>
      )}
      <main className={styles.main}>
        <div className={`${styles.uploadArea} ${isUploading ? styles.disabled : ''} ${(uploadProgress > 0 || uploadStatus) ? styles.withProgress : ''}`}>
          <p className={styles.uploadText}>
            Drag and drop your file here<br />
            <span>or</span>
          </p>
          <p className={styles.uploadHint}>
            You can also paste files using Ctrl+V / Cmd+V
          </p>
          <label className={`${styles.fileInputLabel} ${isUploading ? styles.disabled : ''}`}>
            <input
              type="file" 
              name="file"
              className={styles.fileInput}
              disabled={isUploading}
              onChange={(e) => handleUpload(e.target.files[0])}
            />
            Choose a file
          </label>

          {(uploadProgress > 0 || uploadStatus) && (
            <div className={styles.uploadProgress}>
              {uploadStatus ? (
                <div className={`${styles.uploadStatus} ${styles[uploadStatus]}`}>
                  {uploadStatus === 'success' ? (
                    <>
                      <p>✓ Upload completed successfully!</p>
                      <button type="button" className={styles.restartButton} onClick={resetUpload}>
                        ↺ Upload another file
                      </button>
                    </>
                  ) : (
                    <>
                      <p>✕ Upload failed. Please try again.</p>
                      <button type="button" className={styles.restartButton} onClick={resetUpload}>
                        ↺ Try again
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.uploadProgressHeader}>
                    <div className={styles.fileIcon}>📄</div>
                    <div>Uploading...</div>
                  </div>
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className={styles.progressStats}>
                    <span>{formatBytes(uploadStats.loaded)} / {formatBytes(uploadStats.total)}</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}