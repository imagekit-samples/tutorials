import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadFormComponent } from './upload-form/upload-form.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UploadFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'imagekit-angular-app';
}
