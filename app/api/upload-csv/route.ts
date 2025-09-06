import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { CsvImportSchema, validateFileName, formatFileSize } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('csv');
    const hasHeaders = formData.get('hasHeaders') === 'true';
    const delimiter = formData.get('delimiter')?.toString() || ',';
    
    // Validate file presence
    if (!file || typeof file === 'string') {
      return NextResponse.json({ 
        error: 'No CSV file uploaded',
        details: ['Please select a CSV file to import']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Type assertion for File object
    const uploadedFile = file as File;
    
    // Enhanced Zod validation
    const validation = CsvImportSchema.safeParse({ 
      file: uploadedFile,
      hasHeaders,
      delimiter
    });
    
    if (!validation.success) {
      const details = validation.error.errors.map(err => err.message);
      return NextResponse.json({ 
        error: 'CSV validation failed',
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
    
    // Process CSV file
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const content = new TextDecoder('utf-8').decode(arrayBuffer);
    
    // Basic CSV parsing and validation
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return NextResponse.json({ 
        error: 'Empty CSV file',
        details: ['The uploaded CSV file is empty']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse CSV data
    let headers: string[] = [];
    let dataRows: string[][] = [];
    
    try {
      if (hasHeaders && lines.length > 0) {
        headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
        dataRows = lines.slice(1).map(line => 
          line.split(delimiter).map(cell => cell.trim().replace(/"/g, ''))
        );
      } else {
        // Generate generic headers if no headers provided
        const firstRow = lines[0].split(delimiter);
        headers = firstRow.map((_, index) => `Column_${index + 1}`);
        dataRows = lines.map(line => 
          line.split(delimiter).map(cell => cell.trim().replace(/"/g, ''))
        );
      }
      
      // Validate data consistency
      const inconsistentRows = dataRows.filter(row => row.length !== headers.length);
      if (inconsistentRows.length > 0) {
        return NextResponse.json({ 
          error: 'Inconsistent CSV data',
          details: [
            `Found ${inconsistentRows.length} rows with inconsistent column counts`,
            `Expected ${headers.length} columns but found rows with different counts`
          ]
        }, { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'CSV parsing failed',
        details: ['Unable to parse CSV file. Please check the format and delimiter.']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate safe filename and save processed CSV
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const baseName = uploadedFile.name
      .replace(/\.csv$/i, '')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .substring(0, 30);
    const filename = `csv_${timestamp}_${randomSuffix}_${baseName}.csv`;
    
    // Ensure CSV directory exists
    const csvDir = path.join(process.cwd(), 'public', 'csv-imports');
    await fs.mkdir(csvDir, { recursive: true });
    
    // Save processed CSV
    const filePath = path.join(csvDir, filename);
    await fs.writeFile(filePath, content, 'utf-8');
    
    // Create response data with preview
    const preview = dataRows.slice(0, 5); // First 5 rows for preview
    
    const responseData = {
      success: true,
      filename: filename,
      originalName: uploadedFile.name,
      url: `/csv-imports/${filename}`,
      size: uploadedFile.size,
      formattedSize: formatFileSize(uploadedFile.size),
      uploadedAt: new Date(),
      csvInfo: {
        totalRows: dataRows.length,
        totalColumns: headers.length,
        hasHeaders,
        delimiter,
        headers,
        preview
      }
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('CSV import error:', error);
    
    if (error.code === 'ENOSPC') {
      return NextResponse.json({ 
        error: 'Insufficient storage space',
        details: ['Server storage is full. Please try again later.']
      }, { 
        status: 507,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'CSV validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid CSV format']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'CSV import failed',
      details: ['An unexpected error occurred during CSV import.']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}