import styles from "../page.module.css";

export default function Home() {
  return (
    <main >
      <div className={styles.container}>
        <video height="200" width="200"
          autoPlay
          muted
          playsInline
          controls
          poster="https://ik.imagekit.io/ikmedia/example_video.mp4/ik-thumbnail.jpg?tr=so-7.5,w-200,h-200" >
          <source src="https://ik.imagekit.io/ikmedia/example_video.mp4?tr=w-200,h-200,c-maintain_ratio" />
          Your browser does not support the video tag...
        </video>
      </div>
    </main>
  );
}