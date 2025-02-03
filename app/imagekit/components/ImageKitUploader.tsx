'use client';

import { ImageKitProvider, IKUpload } from "imagekitio-next";
import React, { useRef, useCallback } from "react";
import FileUploader from '../../components/FileUploader';
import { IKUploadResponse, UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";

interface ImageKitUploaderProps {
  onUploadSuccess: (response: IKUploadResponse) => void;
  onError: (error: UploadError) => void;
  uploadProgress: number
  setErrorMessage: (message: string | null) => void;
  setUploadProgress: (progress: number) => void;
}

// Read from .env or fallback if needed
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY || "";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT || "";

const ImageKitUploader: React.FC<ImageKitUploaderProps> = ({
  onUploadSuccess,
  onError,
  uploadProgress,
  setErrorMessage,
  setUploadProgress
}) => {
  const ikUploadRef = useRef<HTMLInputElement | null>(null);

  // Authentication for ImageKit
  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth");
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return { signature: data.signature, expire: data.expire, token: data.token };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  // Trigger actual file upload
  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);

    try {
      uploadViaIkSdk(file);
    } catch (err) {
      console.error('An error occured during imagekit upload', err);
      setErrorMessage('An error occurred during uploading.');
    } finally {
      setUploadProgress(0);
    }
  };

  // Programmatically set a single File to IKUpload's <input type="file">
  const uploadViaIkSdk = useCallback((file: File) => {
    if (ikUploadRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'files'
      )?.set;

      nativeInputValueSetter?.call(ikUploadRef.current, dataTransfer.files);
      const changeEvent = new Event('change', { bubbles: true });
      ikUploadRef.current.dispatchEvent(changeEvent);
    }
  }, []);

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        style={{ visibility: 'hidden', height: 0, width: 0 }} // hide the default button
        validateFile={(file) => file.type.startsWith('video/')}

        // ▲ Called on errors
        onError={(error) => {
          onError(error);
        }}

        // ▲ Called on success
        onSuccess={(response) => {
          onUploadSuccess(response);
        }}

        // ▲ Called repeatedly for progress updates
        onUploadProgress={(progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(percentComplete);
          }
        }}
      />

      {/* ▲ Display upload progress bar if between 1% & 99% */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full max-w-md mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-sm mt-1 text-gray-600">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {uploadProgress === 0 && <FileUploader
        onFileSelect={handleFileUpload}
      />}
    </ImageKitProvider>
  );
};

export default ImageKitUploader;
