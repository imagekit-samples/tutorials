'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import '../globals.css'

interface RootLayoutProps {
  children: React.ReactNode;
}

// Dynamically import the FFmpegProvider as a client component
const FFmpegProvider = dynamic(
  () => import('../components/FFmpegProvider').then(mod => mod.FFmpegProvider),
  { ssr: false }
);

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    // Wrap the main content with FFmpegProvider
    <FFmpegProvider>
      {children}
    </FFmpegProvider>
  );
};

export default RootLayout;