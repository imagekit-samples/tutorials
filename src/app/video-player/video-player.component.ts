import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import videojs from "video.js";

@Component({
  selector: "app-video-player",
  standalone: true,
  imports: [],
  template:
    '<video #target class="video-js" controls muted playsinline preload="none"></video>',
  styleUrls: ["../../../node_modules/video.js/dist/video-js.min.css"],
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  private player: any;

  @ViewChild("target", { static: true }) target: ElementRef;
  @Input() videoSource: string = "";
  @Input() poster?: string; // Cover image
  @Input() aspectRatio?: string; // Strictly defines aspect ratio for the video-player
  @Input() fluid?: boolean; // Player should be responsive and adapt to its container size

  constructor(elementRef: ElementRef) {
    this.target = elementRef;
  }

  ngOnInit() {
    this.player = videojs(this.target.nativeElement, {
      sources: [{ src: this.videoSource }],
      aspectRatio: this.aspectRatio,
      fluid: this.fluid,
      poster: this.poster,
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
