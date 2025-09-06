import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { BulkFileUploadSchema, validateFileName, formatFileSize } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    // Basic validation
    if (!files || files.length === 0) {
      return NextResponse.json({ 
        error: 'No files uploaded',
        details: ['Please select at least one file to upload']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Enhanced Zod validation for bulk upload
    const validation = BulkFileUploadSchema.safeParse({ files });
    
    if (!validation.success) {
      const details = validation.error.errors.map(err => err.message);
      return NextResponse.json({ 
        error: 'Bulk upload validation failed',
        details
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate each file name
    for (const file of files) {
      if (!validateFileName(file.name)) {
        return NextResponse.json({
          error: 'Invalid file name',
          details: [`File "${file.name}" contains invalid characters or is too long`]
        }, {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Ensure bulk uploads directory exists
    const bulkDir = path.join(process.cwd(), 'public', 'bulk-uploads');
    await fs.mkdir(bulkDir, { recursive: true });
    
    // Process each file
    const uploadResults = [];
    const timestamp = Date.now();
    const batchId = Math.random().toString(36).substring(2, 8);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const baseName = file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[^a-zA-Z0-9_\-]/g, '_') // Replace special chars
          .substring(0, 30); // Limit length for bulk uploads
        const filename = `bulk_${timestamp}_${batchId}_${i}_${baseName}.${ext}`;
        
        const filePath = path.join(bulkDir, filename);
        await fs.writeFile(filePath, new Uint8Array(arrayBuffer));
        
        uploadResults.push({
          success: true,
          originalName: file.name,
          filename: filename,
          url: `/bulk-uploads/${filename}`,
          size: file.size,
          mimeType: file.type,
          formattedSize: formatFileSize(file.size)
        });
        
      } catch (fileError) {
        console.error(`Error uploading file ${file.name}:`, fileError);
        uploadResults.push({
          success: false,
          originalName: file.name,
          error: 'Failed to upload file',
          details: ['An error occurred while processing this file']
        });
      }
    }
    
    // Calculate statistics
    const successCount = uploadResults.filter(result => result.success).length;
    const failureCount = uploadResults.length - successCount;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    const responseData = {
      batchId,
      uploadedAt: new Date(),
      summary: {
        total: files.length,
        successful: successCount,
        failed: failureCount,
        totalSize: totalSize,
        formattedTotalSize: formatFileSize(totalSize)
      },
      results: uploadResults
    };
    
    // Return appropriate status code
    const statusCode = failureCount > 0 ? (successCount > 0 ? 207 : 400) : 200;
    
    return NextResponse.json(responseData, {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Bulk upload error:', error);
    
    // Handle specific errors
    if (error.code === 'ENOSPC') {
      return NextResponse.json({ 
        error: 'Insufficient storage space',
        details: ['Server storage is full. Please try uploading fewer files.']
      }, { 
        status: 507,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Bulk upload validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid file format']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Bulk upload failed',
      details: ['An unexpected error occurred during bulk upload.']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}