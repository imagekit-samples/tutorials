import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [NgFor],
  template: `
    <video
      [poster]="poster"
      [height]="height"
      [width]="width"
      [controls]="controls"
      [autoplay]="autoplay"
      [loop]="loop"
      [muted]="muted ?? autoplay"
      [playsInline]="playsInline ?? autoplay"
    >
      <source
        *ngFor="let v of videoSources"
        [src]="v.src"
        [type]="v.mimeType"
      />
      Your browser does not support the video tag...
    </video>
  `,
})
export class VideoPlayerComponent {
  @Input() videoSources: { src: string; mimeType?: string }[] = [];
  @Input() poster?: string;
  @Input() height?: string;
  @Input() width?: string;
  @Input() controls: boolean = true;
  @Input() loop: boolean = false;
  @Input() autoplay: boolean = false;
  @Input() muted?: boolean;
  @Input() playsInline?: boolean;
}
