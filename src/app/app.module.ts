import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { AppRoutingModule } from './app-routing.module';
import { ImagekitUploadFormComponent } from './imagekit-upload-form/imagekit-upload-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ImagekitUploadFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ImagekitioAngularModule.forRoot({
      urlEndpoint: "https://ik.imagekit.io/igi7ywjzdi",
      publicKey: "public_X140up/8w//8965Hp/pI8VCM6QY=",
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
