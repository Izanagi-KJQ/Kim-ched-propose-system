import React, { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Image, File, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AvatarUploadSchema, 
  DocumentUploadSchema, 
  BulkFileUploadSchema,
  CsvImportSchema,
  formatFileSize,
  validateFileType,
  validateFileSize 
} from '@/lib/validations';

export type FileUploadType = 'avatar' | 'document' | 'bulk' | 'csv';

interface FileUploadProps {
  type: FileUploadType;
  onUpload: (files: FileList | File[]) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  description?: string;
}

const getSchemaForType = (type: FileUploadType) => {
  switch (type) {
    case 'avatar':
      return AvatarUploadSchema;
    case 'document':
      return DocumentUploadSchema;
    case 'bulk':
      return BulkFileUploadSchema;
    case 'csv':
      return CsvImportSchema;
    default:
      return AvatarUploadSchema;
  }
};

const getAcceptedTypes = (type: FileUploadType) => {
  switch (type) {
    case 'avatar':
      return 'image/jpeg,image/png,image/gif,image/webp';
    case 'document':
      return '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp';
    case 'bulk':
      return '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp';
    case 'csv':
      return '.csv,text/csv,application/vnd.ms-excel';
    default:
      return 'image/*';
  }
};

const getMaxSize = (type: FileUploadType) => {
  switch (type) {
    case 'avatar':
      return 30 * 1024 * 1024; // 30MB
    case 'document':
      return 50 * 1024 * 1024; // 50MB
    case 'bulk':
      return 100 * 1024 * 1024; // 100MB total
    case 'csv':
      return 10 * 1024 * 1024; // 10MB
    default:
      return 30 * 1024 * 1024;
  }
};

const getFileIcon = (fileName: string, mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Image className="h-4 w-4" />;
  }
  if (mimeType === 'text/csv' || fileName.endsWith('.csv')) {
    return <FileText className="h-4 w-4" />;
  }
  return <File className="h-4 w-4" />;
};

export function FileUpload({
  type,
  onUpload,
  onSuccess,
  onError,
  className,
  disabled = false,
  multiple = false,
  maxFiles = 10,
  description
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const schema = getSchemaForType(type);
  const acceptedTypes = getAcceptedTypes(type);
  const maxSize = getMaxSize(type);

  const validateFiles = useCallback((files: File[]) => {
    const errors: string[] = [];
    
    // Validate each file with appropriate schema
    files.forEach((file, index) => {
      try {
        if (type === 'bulk') {
          // For bulk uploads, validate the entire array
          const validation = schema.safeParse({ files });
          if (!validation.success) {
            validation.error.errors.forEach(err => {
              errors.push(err.message);
            });
          }
        } else {
          // For individual files
          const validation = schema.safeParse({ file });
          if (!validation.success) {
            validation.error.errors.forEach(err => {
              errors.push(`File ${index + 1} (${file.name}): ${err.message}`);
            });
          }
        }
      } catch (error) {
        errors.push(`File ${index + 1} (${file.name}): Validation error`);
      }
    });
    
    // Additional validations
    if (multiple && files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }
    
    return errors;
  }, [schema, type, multiple, maxFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const errors = validateFiles(files);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      setSelectedFiles(files);
    } else {
      setSelectedFiles([]);
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults([]);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      const result = await onUpload(multiple ? selectedFiles : selectedFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadResults(Array.isArray(result) ? result : [result]);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Reset after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadProgress(0);
        setUploadResults([]);
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setValidationErrors([errorMessage]);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setValidationErrors([]);
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* File Input Area */}
      <div className="space-y-2">
        <Label htmlFor={`file-upload-${type}`}>
          {type === 'avatar' && 'Upload Avatar'}
          {type === 'document' && 'Upload Document'}
          {type === 'bulk' && 'Bulk File Upload'}
          {type === 'csv' && 'Import CSV'}
        </Label>
        
        <div 
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            'hover:border-purple-400 hover:bg-purple-50/50',
            'dark:hover:border-purple-500 dark:hover:bg-purple-950/20',
            disabled && 'opacity-50 cursor-not-allowed',
            validationErrors.length > 0 && 'border-red-300 bg-red-50/50'
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to select {multiple ? 'files' : 'a file'} or drag and drop
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Max size: {formatFileSize(maxSize)}
            {multiple && ` • Max ${maxFiles} files`}
          </p>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files ({selectedFiles.length})</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getFileIcon(file.name, file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Total Size */}
          {multiple && selectedFiles.length > 1 && (
            <div className="text-sm text-muted-foreground">
              Total size: {formatFileSize(getTotalSize())}
            </div>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Uploading...</Label>
            <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="space-y-2">
          <Label>Upload Results</Label>
          <div className="space-y-1">
            {uploadResults.map((result, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="flex-1">
                  {result.originalName || result.filename} uploaded successfully
                </span>
                <Badge variant="secondary">{formatFileSize(result.size)}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && validationErrors.length === 0 && (
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || disabled}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`}
        </Button>
      )}
    </div>
  );
}