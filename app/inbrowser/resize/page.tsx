// app/page.tsx (server component by default in App Router)
'use client';
import dynamic from 'next/dynamic';

// Dynamically import the Resizing component with SSR disabled
  const Resizing = dynamic(
    () => import('../components/Resize').then((mod) => mod.Resizing),
    { ssr: false }
  );

export default function Page() {
  return <Resizing />;
}