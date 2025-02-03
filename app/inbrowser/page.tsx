import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Video Editing Tools
      </h1>

      {/* Flex container for spacing between buttons */}
      <div className="flex space-x-4">
        <Link
          href="/inbrowser/resize"
          className="px-6 py-3 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Resize
        </Link>

        <Link
          href="/inbrowser/crop"
          className="px-6 py-3 text-lg text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        >
          Crop
        </Link>
      </div>
    </main>
  );
}
