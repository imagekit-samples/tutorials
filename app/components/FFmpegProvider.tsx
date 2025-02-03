'use client';

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Define the shape of the context
interface FFmpegContextType {
    ffmpeg: FFmpeg | null;
    loading: boolean;
    error: string | null;
}

// Create the context with default values
const FFmpegContext = createContext<FFmpegContextType>({
    ffmpeg: null,
    loading: true,
    error: null,
});

// Create a custom hook for easy access to the context
export const useFFmpeg = () => useContext(FFmpegContext);

// Define the provider's props
interface FFmpegProviderProps {
    children: ReactNode;
}

// FFmpegProvider Component
export const FFmpegProvider: React.FC<FFmpegProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const ffmpegRef = useRef<FFmpeg | null>(null);

    useEffect(() => {
        const loadFFmpeg = async () => {
            try {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
                const ffmpeg = new FFmpeg();
                ffmpegRef.current = ffmpeg;

                ffmpeg.on('log', ({ message }) => {
                    console.log(message);
                });

                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });

                setLoading(false);
            } catch (err) {
                console.error('Failed to load FFmpeg:', err);
                setError('Failed to load FFmpeg');
                setLoading(false);
            }
        };

        loadFFmpeg();
    }, []);

    return (
        <FFmpegContext.Provider value={{ ffmpeg: ffmpegRef.current, loading, error }}>
            {children}
        </FFmpegContext.Provider>
    );
};
