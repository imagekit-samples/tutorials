import { Component, ViewChild } from '@angular/core';
import { HTMLInputEvent } from 'imagekitio-angular/lib/utility/ik-type-def-collection';
import { IkUploadComponent } from 'imagekitio-angular';

@Component({
  selector: 'app-imagekit-upload-form',
  templateUrl: './imagekit-upload-form.component.html',
  styleUrl: './imagekit-upload-form.component.css',
})
export class ImagekitUploadFormComponent {
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  constructor() {}

  title = 'app';
  @ViewChild('upload') uploadComponent: IkUploadComponent;
  uploadErrorMessage = '';

  authenticator = async () => {
    try {
      // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
      const response = await fetch('/api/auth');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  validateFileFunction = (file: File): boolean => {
    console.log('validating', file);
    if (file.size > 2000000) {
      // Less than 2mb
      this.fileName = file.name;
      this.outputBoxVisible = true;
      this.uploadStatus = 413;
      this.uploadResult = 'File size should be less than 2mb';
      return false;
    }
    if (!(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      this.fileName = file.name;
      this.outputBoxVisible = true;
      this.uploadStatus = 403;
      this.uploadResult = 'Only image and video files are allowed';
      return false;
    }
    return true;
  };

  onUploadStartFunction = (event: HTMLInputEvent) => {
    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    if (event.target?.files?.length) {
      const file: File = event.target?.files[0];
      this.fileName = file.name;
      this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
      this.outputBoxVisible = true;
    }
    console.log('onUploadStart');
  };

  onAbortFunction = () => {
    this.uploadComponent && this.uploadComponent.abort();
  };

  onUploadProgressFunction = (event: ProgressEvent): void => {
    const progress = (event.loaded / event.total) * 100;
    this.progress = `${Math.round(progress)}%`;
    console.log('progressing', { progress: this.progress });
  };

  handleUploadSuccess = (res) => {
    console.log('File upload success with response: ', res);

    if (res.$ResponseMetadata.statusCode === 200) {
      this.uploadResult = 'Uploaded';
      this.outputBoxVisible = true;
    }
    this.uploadStatus = res.$ResponseMetadata.statusCode;
  };

  handleUploadError = (err) => {
    console.log('There was an error in upload: ', err);
    this.uploadErrorMessage = 'File upload failed.';
    this.uploadResult = 'File upload failed!';
  };
}
