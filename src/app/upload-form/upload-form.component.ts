import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css',
})
export class UploadFormComponent {
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;

  constructor() {}

  onFileSelected(event: any) {
    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus =undefined;
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
      this.outputBoxVisible = true;

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:4000/upload', true);

      xhr.upload.onprogress = (progressEvent) => {
        console.log({ progressEvent });
        if (progressEvent.lengthComputable) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          this.progress = `${Math.round(progress)}%`;
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            this.uploadResult = 'Uploaded';
          } else if (xhr.status === 400) {
            console.log({xhr})
            this.uploadResult = JSON.parse(xhr.response)!.message;
          } else {
            this.uploadResult = 'File upload failed!';
          }
          this.uploadStatus = xhr.status;
        }
      };

      xhr.send(formData);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log({ event });
    const file: File = event.dataTransfer!.files[0];
    this.onFileSelected(file);
  }
}
