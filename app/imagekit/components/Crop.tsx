'use client';

import { ImageKitClient } from "imagekitio-next";
import React, { useState } from "react";
import ImageKitUploader from "./ImageKitUploader";
import { waitForVideoReady } from "../utils";


export const Cropping: React.FC = () => {
    const [videoSrc, setVideoSrc] = useState<string>('');
    const [inputSrc, setInputSrc] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [ogVideoDimensions, setOgVideoDimensions] = useState<{ width: number; height: number } | null>(null);

    // Track upload progress in percentage (0 - 100)
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    function getNewDimensions(originalWidth: number, originalHeight: number, aspectRatioStr: string) {
        // Parse ratio "16:9" => [16, 9]
        const [ratioW, ratioH] = aspectRatioStr.split(':').map(Number);
        const targetRatio = ratioW / ratioH;

        const originalRatio = originalWidth / originalHeight;

        let cropWidth, cropHeight;

        if (originalRatio > targetRatio) {
            // If the video is wider than the target ratio, crop width
            cropWidth = Math.round(originalHeight * targetRatio);
            cropHeight = originalHeight;
        } else {
            // If the video is taller (or equal) than target ratio, crop height
            cropWidth = originalWidth;
            cropHeight = Math.round(originalWidth / targetRatio);
        }

        // "cm-extract" -> Extract a rectangle of size cropWidth x cropHeight 
        // Default focus is center, but we explicitly set "fo-center" to match typical FFmpeg default
        return [cropWidth, cropHeight];
    }

    // Crops the video after it is already uploaded to "input.mp4" with ffmpeg
    const cropFile = async () => {
        setProcessing(true);
        setErrorMessage(null);

        try {
            // 1. Create an ImageKit instance (for demonstration)
            const imagekit = new ImageKitClient({
                publicKey: "does_not_matter",
                urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT ?? "",
            });

            // 2. Build the transformation URL (width/height etc.)

            if (!ogVideoDimensions) {
                throw new Error("Original video dimensions are missing"); // Should never happen
            }
            const [width, height] = getNewDimensions(ogVideoDimensions.width, ogVideoDimensions.height, aspectRatio);
            const url = imagekit.url({
                src: inputSrc,  // the original video path in your ImageKit media library
                transformation: [
                    {
                        height: height.toString(),
                        width: width.toString(),
                        cropMode: "extract",
                    },
                ],
                transformationPosition: "query",
            });

            console.log("Transformation URL:", url);

            // 3. Check if the video is ready
            const ready = await waitForVideoReady(url, 5, 3000);

            if (!ready) {
                throw new Error("Video is not ready after multiple attempts");
            }

            // 4. If it’s ready, set it to videoSrc so user can watch
            setVideoSrc(url);

        } catch (err) {
            console.error('Error processing video:', err);
            setErrorMessage('An error occurred during processing.');
        } finally {
            setProcessing(false);
        }
    };

    // Resets everything
    const resetProcessing = () => {
        setInputSrc('');
        setVideoSrc('');
        setProcessing(false);
        setErrorMessage(null);

        // Reset the progress bar
        setUploadProgress(0);
    };

    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4">Crop Video</h1>
            
            {/* Error Message */}
            {errorMessage && (
                <div className="w-full max-w-md mb-4 bg-red-100 text-red-700 p-3 rounded shadow">{errorMessage}</div>
            )}

            {/* ImageKit Uploader */}
            {!inputSrc && <ImageKitUploader
                uploadProgress={uploadProgress}
                setErrorMessage={setErrorMessage}
                setUploadProgress={setUploadProgress}
                onUploadSuccess={(response) => {
                    setInputSrc(response.url);
                    setOgVideoDimensions({ width: response.width, height: response.height });
                }}
                onError={(error) => {
                    setErrorMessage(`Upload failed: ${error?.message}`);
                    setUploadProgress(0);
                }}
            ></ImageKitUploader>}

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

            {/* Processing Indicator if cropping locally with ffmpeg */}
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