'use client';

import React, { useEffect, useState } from "react";
import { useFFmpeg } from '../../components/FFmpegProvider';
import { fetchFile } from '@ffmpeg/util';
import FileUploader from '../../components/FileUploader'; // Import the reusable file uploader

export const Resizing: React.FC = () => {
    const { ffmpeg, loading: ffmpegLoading, error } = useFFmpeg();
    const [videoSrc, setVideoSrc] = useState<string>('');
    const [inputSrc, setInputSrc] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(200);
    const [height, setHeight] = useState<number>(200);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    const handleFileUpload = async (file: File) => {
        setProcessing(true);
        setErrorMessage(null);

        try {
            if (ffmpeg) {
                await ffmpeg.writeFile('input.mp4', await fetchFile(file));
            } else {
                setErrorMessage('FFmpeg is not initialized.');
            }
            setInputSrc(URL.createObjectURL(file));
        } catch (err) {
            console.error('Error processing video:', err);
            setErrorMessage('An error occurred during processing.');
        } finally {
            setProcessing(false);
        }
    };

    const resizeFile = async () => {
        if (ffmpegLoading || !ffmpeg) {
            setErrorMessage('FFmpeg is still loading. Please wait...');
            return;
        }

        setProcessing(true);
        setErrorMessage(null);

        try {
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-vf', `scale=${width}:${height}`,
                'output.mp4'
            ]);

            const data = await ffmpeg.readFile('output.mp4');
            setVideoSrc(URL.createObjectURL(new Blob([data], { type: 'video/mp4' })));
        } catch (err) {
            console.error('Error processing video:', err);
            setErrorMessage('An error occurred during processing.');
        } finally {
            setProcessing(false);
        }
    };

    const resetProcessing = () => {
        setInputSrc('');
        setVideoSrc('');
        setProcessing(false);
        setErrorMessage(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4">Resize Video</h1>

            {/* Error Message */}
            {errorMessage && (
                <div className="w-full max-w-md mb-4 bg-red-100 text-red-700 p-3 rounded shadow">{errorMessage}</div>
            )}

            {/* File Upload Component */}
            {!inputSrc && <FileUploader onFileSelect={handleFileUpload} />}

            {/* Resizing Options & Resize Button */}
            {inputSrc && (
                <div className="mt-6 w-full max-w-md bg-white shadow-md p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Select Width & Height</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-1">Width</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-1">Height</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <button
                        onClick={resizeFile}
                        disabled={processing}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        Resize
                    </button>
                </div>
            )}

            {/* Change Video Button */}
            {inputSrc && (
                <button
                    onClick={resetProcessing}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Change Video
                </button>
            )}

            {/* Processing Indicator */}
            {processing && <p className="mt-4 text-gray-500">Processing...</p>}

            {/* Original Video Preview */}
            {inputSrc && (
                <div className="mt-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold">Original Video</h3>
                    <video src={inputSrc} controls className="rounded-lg shadow-md mt-2"></video>
                </div>
            )}

            {/* Resized Video Preview */}
            {videoSrc && !processing && (
                <div className="mt-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold">Resized Video</h3>
                    <video src={videoSrc} controls className="rounded-lg shadow-md mt-2"></video>
                    <a
                        href={videoSrc}
                        download="output.mp4"
                        className="block text-center mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Download Video
                    </a>
                </div>
            )}
        </div>
    );
};
