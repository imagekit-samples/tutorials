'use client';

import { ImageKitClient } from "imagekitio-next";
import React, { useState } from "react";
import ImageKitUploader from "./ImageKitUploader";
import { waitForVideoReady } from "../utils";


export const Resizing: React.FC = () => {
    const [videoSrc, setVideoSrc] = useState<string>('');
    const [inputSrc, setInputSrc] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(200);
    const [height, setHeight] = useState<number>(200);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Track upload progress in percentage (0 - 100)
    const [uploadProgress, setUploadProgress] = useState<number>(0);


    // Resizes the video after it is already uploaded to "input.mp4" with ffmpeg
    const resizeFile = async () => {
        setProcessing(true);
        setErrorMessage(null);

        try {
            // 1. Create an ImageKit instance (for demonstration)
            const imagekit = new ImageKitClient({
                publicKey: "does_not_matter",
                urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT ?? "",
            });

            // 2. Build the transformation URL (width/height etc.)
            const url = imagekit.url({
                src: inputSrc,  // the original video path in your ImageKit media library
                transformation: [
                    {
                        height: height.toString(),
                        width: width.toString(),
                        crop: "force",
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
            <h1 className="text-3xl font-bold mb-4">Resize Video</h1>

            {/* Error Message */}
            {errorMessage && (
                <div className="w-full max-w-md mb-4 bg-red-100 text-red-700 p-3 rounded shadow">{errorMessage}</div>
            )}

            {!inputSrc && <ImageKitUploader
                uploadProgress={uploadProgress}
                setErrorMessage={setErrorMessage}
                setUploadProgress={setUploadProgress}
                onUploadSuccess={(response) => {
                    setInputSrc(response.url); // we can store the final url returned by IK
                    setProcessing(false);
                    setUploadProgress(100); // quickly set to 100% if we want
                }}
                onError={(error) => {
                    setErrorMessage(`Upload failed: ${error?.message}`);
                    setUploadProgress(0);
                    setProcessing(false);
                }}
            ></ImageKitUploader>}

            {/* Resizing UI once file is uploaded */}
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

            {/* Processing Indicator if resizing locally with ffmpeg */}
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
                    <video height={`${height}px`} width={`${width}px`} src={videoSrc} controls className="rounded-lg shadow-md mt-2"></video>
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