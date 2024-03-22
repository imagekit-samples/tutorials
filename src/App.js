import React from 'react';
import videojs from 'video.js';
import VideoJS from './components/VideoJS';

// Global player options for this tutorial
const playerOptions = {
  sourceUrl: 'https://ik.imagekit.io/ikmedia/example_video.mp4',
  width: 640,
  controls: true,
  fluid: true,
  autoplay: false,
  muted: false,
  responsive: true,
  playsinline: false,
};

export default function App() {
  const { width: playerWidth, sourceUrl: videoBaseUrl, controls, fluid, responsive, autoplay, muted, playsinline } = playerOptions;
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    controls,
    responsive,
    fluid,
    autoplay,
    muted,
    playsinline,
    sources: [{
      src: `${videoBaseUrl}${playerWidth ? `?tr=w-${playerWidth}` : ''}`,
      type: 'video/mp4'
    }],
    poster: `${videoBaseUrl}/ik-thumbnail.jpg?tr=so-10${playerWidth ? `,w-${playerWidth}` : ''}`
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div>
      <h1>Player with Video.js (ABS enabled)</h1>
      <div style={{ width: `${playerWidth}px` }}>
        <VideoJS options={{
          ...videoJsOptions,
          sources: [{
            src: `${videoBaseUrl}/ik-master.m3u8?tr=sr-240_360_480_720_1080`,
            type: 'application/x-mpegURL'
          }]
        }} onReady={handlePlayerReady} />
      </div>

      <h1>Player with Video.js</h1>
      <div style={{ width: `${playerWidth}px` }}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>

      <h1>Player with HTML5 video tag</h1>
      <video
        src={videoBaseUrl}
        poster={`${videoBaseUrl}/ik-thumbnail.jpg?tr=so-10${playerWidth ? `,w-${playerWidth}` : ''}`}
        width={playerWidth}
        controls={controls}
        autoPlay={autoplay}
        muted={muted}
        playsInline={playsinline}
      />
    </div>
  );
}