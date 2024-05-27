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
      urlEndpoint: "your_endpoint",
      publicKey: "your_public_key",
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
