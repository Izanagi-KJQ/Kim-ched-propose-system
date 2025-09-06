# Enhanced File Upload Validation with Zod

## Overview
This document outlines the comprehensive file upload validation system implemented using Zod for the Kim-ched-propose-system. The system provides type-safe, user-friendly validation for various types of file uploads.

## 🔧 **Enhanced Features**

### 1. **Comprehensive Zod Schemas**
- **AvatarUploadSchema**: Validates avatar image uploads (JPG, PNG, GIF, WEBP, max 30MB)
- **DocumentUploadSchema**: Validates document uploads (PDF, DOC, DOCX, TXT, images, max 50MB)
- **BulkFileUploadSchema**: Validates bulk file uploads (max 10 files, 100MB total)
- **CsvImportSchema**: Validates CSV imports with delimiter and header options (max 10MB)

### 2. **API Endpoints with Zod Validation**
- **`/api/upload-avatar`**: Enhanced avatar upload with Zod validation
- **`/api/upload-document`**: New document upload endpoint
- **`/api/upload-bulk`**: New bulk file upload endpoint
- **`/api/upload-csv`**: New CSV import endpoint

### 3. **Reusable Components**
- **FileUpload Component**: Type-safe, configurable file upload component
- **Enhanced ApplicationCreateForm**: Updated with Zod file validation

## 📋 **Validation Rules**

### Avatar Upload
```typescript
- File types: JPG, PNG, GIF, WEBP
- Max size: 30MB
- Min size: 1KB
- File name validation: alphanumeric characters only
```

### Document Upload
```typescript
- File types: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP
- Max size: 50MB
- Optional description field (max 255 characters)
- File name validation
```

### Bulk Upload
```typescript
- Max files: 10 per batch
- Total size limit: 100MB
- Individual file validation
- Batch progress tracking
```

### CSV Import
```typescript
- File types: CSV only
- Max size: 10MB
- Header detection: configurable
- Delimiter options: comma, semicolon, tab, pipe
- Data consistency validation
```

## 🛡️ **Security Features**

### File Validation
- **Type checking**: MIME type validation
- **Size limits**: Configurable per upload type
- **Name sanitization**: Special character removal
- **Extension validation**: Double-check file extensions

### Error Handling
- **Detailed error messages**: User-friendly validation feedback
- **Error categorization**: Different error types (validation, server, permission)
- **Structured responses**: Consistent API error format

### Upload Security
- **Unique filenames**: Timestamp + random suffix
- **Safe directories**: Separate folders for different upload types
- **File overwrite prevention**: Automatic filename collision handling

## 🎯 **Usage Examples**

### Basic Avatar Upload
```typescript
import { FileUpload } from '@/components/ui/file-upload';

function AvatarUploadExample() {
  const handleUpload = async (files: FileList | File[]) => {
    const formData = new FormData();
    formData.append('avatar', files[0] as File);
    
    const response = await fetch('/api/upload-avatar', {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  };

  return (
    <FileUpload
      type="avatar"
      onUpload={handleUpload}
      onSuccess={(result) => console.log('Upload successful:', result)}
      onError={(error) => console.error('Upload failed:', error)}
      description="Upload your profile picture"
    />
  );
}
```

### Document Upload with Description
```typescript
function DocumentUploadExample() {
  const handleUpload = async (files: FileList | File[]) => {
    const formData = new FormData();
    formData.append('document', files[0] as File);
    formData.append('description', 'Important document');
    
    const response = await fetch('/api/upload-document', {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  };

  return (
    <FileUpload
      type="document"
      onUpload={handleUpload}
      description="Upload documents (PDF, DOC, DOCX, TXT, images)"
    />
  );
}
```

### Bulk File Upload
```typescript
function BulkUploadExample() {
  const handleUpload = async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    const response = await fetch('/api/upload-bulk', {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  };

  return (
    <FileUpload
      type="bulk"
      multiple={true}
      maxFiles={10}
      onUpload={handleUpload}
      description="Upload multiple files at once"
    />
  );
}
```

## 📊 **Validation Helper Functions**

### File Type Validation
```typescript
import { validateFileType, validateFileSize, formatFileSize } from '@/lib/validations';

// Check if file type is allowed
const isValidType = validateFileType(file, ['image/jpeg', 'image/png']);

// Check if file size is within limits
const isValidSize = validateFileSize(file, 30 * 1024 * 1024); // 30MB

// Format file size for display
const formattedSize = formatFileSize(file.size); // "1.5 MB"
```

### Schema Validation
```typescript
import { AvatarUploadSchema } from '@/lib/validations';

// Validate file with Zod schema
const result = AvatarUploadSchema.safeParse({ file });
if (!result.success) {
  console.error('Validation errors:', result.error.errors);
}
```

## 🔄 **API Response Format**

### Successful Upload Response
```typescript
{
  url: "/avatars/avatar_1234567890_abc123.jpg",
  filename: "avatar_1234567890_abc123.jpg",
  originalName: "profile-picture.jpg",
  size: 1572864,
  mimeType: "image/jpeg",
  uploadedAt: "2025-01-05T15:30:00.000Z",
  formattedSize: "1.5 MB"
}
```

### Error Response
```typescript
{
  error: "File validation failed",
  details: [
    "File size must be less than 30MB",
    "Only JPG, PNG, GIF, or WEBP images are allowed"
  ]
}
```

### Bulk Upload Response
```typescript
{
  batchId: "abc123",
  uploadedAt: "2025-01-05T15:30:00.000Z",
  summary: {
    total: 5,
    successful: 4,
    failed: 1,
    totalSize: 10485760,
    formattedTotalSize: "10 MB"
  },
  results: [
    {
      success: true,
      originalName: "document1.pdf",
      filename: "bulk_1234567890_abc123_0_document1.pdf",
      url: "/bulk-uploads/bulk_1234567890_abc123_0_document1.pdf",
      size: 2097152,
      mimeType: "application/pdf",
      formattedSize: "2 MB"
    },
    // ... more results
  ]
}
```

## 🧪 **Testing**

### Manual Testing Steps
1. **Avatar Upload**: Test with various image formats and sizes
2. **Document Upload**: Test with different document types
3. **Bulk Upload**: Test with multiple files and size limits
4. **CSV Import**: Test with different delimiters and structures
5. **Error Handling**: Test with invalid files and oversized uploads

### Validation Test Cases
- ✅ Valid file types and sizes
- ❌ Invalid file types (e.g., .exe files)
- ❌ Oversized files
- ❌ Empty files
- ❌ Corrupted files
- ❌ Files with malicious names

## 🚀 **Benefits**

### Developer Experience
- **Type Safety**: Full TypeScript support with Zod inference
- **Reusable Components**: Consistent upload behavior across the app
- **Error Handling**: Structured error responses with detailed messages
- **Validation Logic**: Centralized validation rules in schemas

### User Experience
- **Real-time Validation**: Immediate feedback on file selection
- **Progress Tracking**: Upload progress indicators
- **Clear Error Messages**: User-friendly validation messages
- **File Preview**: Display selected files before upload

### Security
- **Server-side Validation**: All uploads validated on the server
- **File Type Checking**: MIME type and extension validation
- **Size Limits**: Configurable limits per upload type
- **Name Sanitization**: Safe filename generation

## 📈 **Future Enhancements**

### Planned Features
- **File Compression**: Automatic image compression before upload
- **Virus Scanning**: Integration with antivirus services
- **Cloud Storage**: Support for AWS S3, Google Cloud Storage
- **Image Processing**: Automatic thumbnail generation
- **Upload Resumption**: Resume interrupted uploads

### Performance Optimizations
- **Chunked Uploads**: Support for large file uploads
- **Background Processing**: Asynchronous file processing
- **CDN Integration**: Content delivery network support
- **Caching**: Intelligent file caching strategies

This enhanced file upload validation system provides a robust, secure, and user-friendly solution for handling file uploads in the scholarship management system.