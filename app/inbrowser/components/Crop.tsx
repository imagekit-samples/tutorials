'use client';

import React, { useEffect, useRef, useState } from "react";
import { useFFmpeg } from '../../components/FFmpegProvider';
import { fetchFile } from '@ffmpeg/util';
import FileUploader from '../../components/FileUploader'; // Import the reusable file uploader


export const Cropping: React.FC = () => {
    const { ffmpeg, loading: ffmpegLoading, error } = useFFmpeg();
    const [videoSrc, setVideoSrc] = useState<string>('');
    const [inputSrc, setInputSrc] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
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
            if (!ffmpeg) {
                throw new Error('FFmpeg is not yet loaded. Please wait...');
            }
            await ffmpeg.writeFile('input.mp4', await fetchFile(file));
            setInputSrc(URL.createObjectURL(file));
        } catch (err) {
            console.error('Error processing video:', err);
            setErrorMessage('An error occurred during processing.');
        } finally {
            setProcessing(false);
        }
    };

    const cropFile = async () => {
        if (ffmpegLoading || !ffmpeg) {
            setErrorMessage('FFmpeg is still loading. Please wait...');
            return;
        }

        setProcessing(true);
        setErrorMessage(null);

        try {
            const [w, h] = aspectRatio.split(':').map(Number);
            const numericAR = w / h;

            const cropFilter = `crop=if(gt(iw/ih\\,${numericAR})\\,ih*${numericAR}\\,iw):if(gt(iw/ih\\,${numericAR})\\,ih\\,iw/${numericAR})`;

            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-vf', cropFilter,
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
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Crop Video</h1>

            {/* Error Message */}
            {errorMessage && (
                <div className="w-full max-w-md mb-4 bg-red-100 text-red-700 p-3 rounded shadow">{errorMessage}</div>
            )}

            {/* File Upload Component */}
            {!inputSrc && <FileUploader onFileSelect={handleFileUpload}/>}

            {/* Aspect Ratio Selection & Crop Button */}
            {inputSrc && (
                <div className="mt-6 w-full max-w-md bg-white shadow-md p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Select Aspect Ratio</h2>
                    <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="16:9">16:9</option>
                        <option value="9:16">9:16</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                        <option value="1:1">1:1</option>
                    </select>
                    <button
                        onClick={cropFile}
                        disabled={processing}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        Crop Video
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


            {/* Cropped Video Preview */}
            {videoSrc && !processing && (
                <div className="mt-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold">Cropped Video</h3>
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
