import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagekitUploadFormComponent } from './imagekit-upload-form.component';

describe('ImagekitUploadFormComponent', () => {
  let component: ImagekitUploadFormComponent;
  let fixture: ComponentFixture<ImagekitUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagekitUploadFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagekitUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
