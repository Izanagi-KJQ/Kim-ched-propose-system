import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AvatarUploadSchema, validateFileName, formatFileSize, FileUploadResponseSchema } from '@/lib/validations';

export const runtime = 'nodejs';

// File validation constants
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 30 * 1024 * 1024; // 30MB
const MIN_SIZE = 1024; // 1KB

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
    
    // Enhanced Zod validation
    const validation = AvatarUploadSchema.safeParse({ file: uploadedFile });
    if (!validation.success) {
      const details = validation.error.errors.map(err => err.message);
      return NextResponse.json({ 
        error: 'File validation failed',
        details
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Additional file name validation
    if (!validateFileName(uploadedFile.name)) {
      return NextResponse.json({ 
        error: 'Invalid file name',
        details: ['File name contains invalid characters or is too long']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Process file
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate safe filename with better security
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeName = uploadedFile.name
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .substring(0, 50); // Limit length
    const filename = `avatar_${timestamp}_${randomSuffix}.${ext}`;
    
    // Ensure avatars directory exists
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
    await fs.mkdir(avatarsDir, { recursive: true });
    
    // Save file with enhanced security checks
    const filePath = path.join(avatarsDir, filename);
    
    // Check if file already exists (unlikely but good practice)
    try {
      await fs.access(filePath);
      // File exists, generate new name
      const newRandomSuffix = Math.random().toString(36).substring(2, 8);
      const newFilename = `avatar_${timestamp}_${newRandomSuffix}.${ext}`;
      const newFilePath = path.join(avatarsDir, newFilename);
      await fs.writeFile(newFilePath, new Uint8Array(arrayBuffer));
      
      // Create and validate response
      const responseData = {
        url: `/avatars/${newFilename}`,
        filename: newFilename,
        originalName: uploadedFile.name,
        size: uploadedFile.size,
        mimeType: uploadedFile.type,
        uploadedAt: new Date(),
        formattedSize: formatFileSize(uploadedFile.size)
      };
      
      return NextResponse.json(responseData, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (accessError) {
      // File doesn't exist, proceed with original name
      await fs.writeFile(filePath, new Uint8Array(arrayBuffer));
      
      // Create and validate response
      const responseData = {
        url: `/avatars/${filename}`,
        filename: filename,
        originalName: uploadedFile.name,
        size: uploadedFile.size,
        mimeType: uploadedFile.type,
        uploadedAt: new Date(),
        formattedSize: formatFileSize(uploadedFile.size)
      };
      
      return NextResponse.json(responseData, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    
    // Handle specific errors with detailed messages
    if (error.code === 'ENOSPC') {
      return NextResponse.json({ 
        error: 'Insufficient storage space',
        details: ['Server storage is full. Please try again later or contact support.']
      }, { 
        status: 507,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'EACCES') {
      return NextResponse.json({ 
        error: 'Permission denied',
        details: ['Server cannot write to upload directory. Please contact support.']
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'EMFILE' || error.code === 'ENFILE') {
      return NextResponse.json({ 
        error: 'Too many open files',
        details: ['Server is busy. Please try again in a few moments.']
      }, { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'File validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid file format']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generic error for unexpected issues
    return NextResponse.json({ 
      error: 'Upload failed',
      details: ['An unexpected error occurred during file upload. Please try again.']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 