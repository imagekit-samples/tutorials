// app/page.tsx (server component by default in App Router)
'use client';
import dynamic from 'next/dynamic';

// Dynamically import the Resizing component with SSR disabled
  const Cropping = dynamic(
    () => import('../components/Crop').then((mod) => mod.Cropping),
    { ssr: false }
  );

export default function Page() {
  return <Cropping />;
}