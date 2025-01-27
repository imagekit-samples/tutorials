'use client';
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <div className={styles.demoContainer}>
        <h1>Next.js upload file demo</h1>
        <Link href="/native-upload" className={styles.demoLink}>
          Native Next.js upload demo
        </Link>
        <Link href="/imagekit-upload" className={styles.demoLink}>
          ImageKit Next.js upload demo
        </Link>
      </div>
    </div>
  );
}