import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DocumentUploadSchema, validateFileName, formatFileSize } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('document');
    const description = formData.get('description')?.toString() || '';
    
    // Validate file presence
    if (!file || typeof file === 'string') {
      return NextResponse.json({ 
        error: 'No file uploaded',
        details: ['Please select a document to upload']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Type assertion for File object
    const uploadedFile = file as File;
    
    // Enhanced Zod validation
    const validation = DocumentUploadSchema.safeParse({ 
      file: uploadedFile,
      description: description || undefined
    });
    
    if (!validation.success) {
      const details = validation.error.errors.map(err => err.message);
      return NextResponse.json({ 
        error: 'Document validation failed',
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
    
    // Generate safe filename
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase() || 'txt';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const baseName = uploadedFile.name
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9_\-]/g, '_') // Replace special chars
      .substring(0, 50); // Limit length
    const filename = `doc_${timestamp}_${randomSuffix}_${baseName}.${ext}`;
    
    // Ensure documents directory exists
    const documentsDir = path.join(process.cwd(), 'public', 'documents');
    await fs.mkdir(documentsDir, { recursive: true });
    
    // Save file
    const filePath = path.join(documentsDir, filename);
    await fs.writeFile(filePath, new Uint8Array(arrayBuffer));
    
    // Create response data
    const responseData = {
      url: `/documents/${filename}`,
      filename: filename,
      originalName: uploadedFile.name,
      size: uploadedFile.size,
      mimeType: uploadedFile.type,
      description: description || null,
      uploadedAt: new Date(),
      formattedSize: formatFileSize(uploadedFile.size)
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Document upload error:', error);
    
    // Handle specific errors
    if (error.code === 'ENOSPC') {
      return NextResponse.json({ 
        error: 'Insufficient storage space',
        details: ['Server storage is full. Please try again later.']
      }, { 
        status: 507,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'EACCES') {
      return NextResponse.json({ 
        error: 'Permission denied',
        details: ['Server cannot write to upload directory.']
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Document validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid document format']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Document upload failed',
      details: ['An unexpected error occurred during document upload.']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}