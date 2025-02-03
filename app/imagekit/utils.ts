/**
 * Polls the generated video URL up to `maxAttempts` times,
 * waiting `intervalMs` between each attempt.
 *
 * Returns true if the video is ready (HTTP 200),
 * or false if the video is still not ready after all attempts.
*/
async function waitForVideoReady(
    videoUrl: string,
    maxAttempts = 5,
    intervalMs = 3000
): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // HEAD is usually enough to check if the content is accessible
            const response = await fetch(videoUrl, {
                method: 'HEAD',
                redirect: 'manual',
            });
            if (response.status === 200) {
                // Video is ready
                return true;
            } else {
                console.log(`Video not ready (status: ${response.status}), attempt ${attempt}`);
            }
        } catch (error) {
            console.log(`Error fetching video: ${error}. Attempt ${attempt}`);
        }

        // Wait before the next attempt
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    // If we exceed maxAttempts, consider it not ready
    return false;
}

export { waitForVideoReady };