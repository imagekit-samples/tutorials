import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Only images and videos are accepted.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    // Validate filename
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (filename !== file.name) {
      return NextResponse.json(
        { error: 'Filename contains invalid characters.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
 
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    // ensure the uploads directory exists
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
 
    return NextResponse.json({
      message: 'File uploaded successfully!',
      filename: filename
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error uploading file.' },
      { status: 500 }
    );
  }
}
