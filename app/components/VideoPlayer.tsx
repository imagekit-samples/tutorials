import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

//to provide quality control in ABS Video
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

export const VideoJS = (props: { options: any; onReady?: any; }) => {
    const placeholderRef = useRef<any>(null);
    const playerRef = useRef<any>(null)
    const { options, onReady } = props;

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const placeholderEl = placeholderRef.current;
            const videoElement = placeholderEl.appendChild(
                document.createElement("video-js")
            );

            const player: any = videojs(videoElement, options, () => {
                player.log("player is ready");
                onReady && onReady(player);
            });

            playerRef.current = player

            // Binding to the source selector plugin in Video.js
            player.httpSourceSelector();

            // You can update player in the `else` block here, for example:
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
        }

    }, [options, onReady]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {

        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return <div ref={placeholderRef}></div>;
};

export default VideoJS;