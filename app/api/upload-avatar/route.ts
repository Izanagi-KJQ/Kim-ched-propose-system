import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// File validation constants
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 30 * 1024 * 1024; // 30MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('avatar');
    
    // Validate file presence
    if (!file || typeof file === 'string') {
      return NextResponse.json({ 
        error: 'No file uploaded',
        details: ['Please select a file to upload']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Type assertion for File object
    const uploadedFile = file as File;
    
    // Validate file type
    if (!ACCEPTED_TYPES.includes(uploadedFile.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type',
        details: ['Only JPG, PNG, GIF, or WEBP images are allowed']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file size
    if (uploadedFile.size > MAX_SIZE) {
      return NextResponse.json({ 
        error: 'File too large',
        details: ['File size must be less than 30MB']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Process file
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate safe filename
    const ext = uploadedFile.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const safeName = uploadedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    
    // Ensure avatars directory exists
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
    await fs.mkdir(avatarsDir, { recursive: true });
    
    // Save file
    const filePath = path.join(avatarsDir, filename);
    await fs.writeFile(filePath, new Uint8Array(arrayBuffer));
    
    // Return URL
    const url = `/avatars/${filename}`;
    
    return NextResponse.json({ 
      url,
      filename,
      size: uploadedFile.size,
      type: uploadedFile.type
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    
    // Handle specific errors
    if (error.code === 'ENOSPC') {
      return NextResponse.json({ 
        error: 'Insufficient storage space',
        details: ['Server storage is full']
      }, { 
        status: 507,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'EACCES') {
      return NextResponse.json({ 
        error: 'Permission denied',
        details: ['Server cannot write to upload directory']
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Upload failed',
      details: ['An unexpected error occurred during file upload']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 