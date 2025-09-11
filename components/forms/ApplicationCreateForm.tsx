import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application, Scholarship } from "@/lib/types";
import { ApplicationCreateSchema, type ApplicationFormData, AvatarUploadSchema, ApplicationDocumentUploadSchema, validateFileType, validateFileSize, formatFileSize } from "@/lib/validations";
import { getCitiesForProvince } from "@/lib/cities";
import { getAmountForScholarship } from "@/lib/scholarships";
import { useState, useRef, useEffect, useCallback } from "react";
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Upload, X, FileText } from "lucide-react";
import React, { useImperativeHandle, forwardRef } from "react";

// Helper function to retrieve document from localStorage
export function getDocumentFromLocalStorage(docId: string) {
  try {
    const docData = localStorage.getItem(`document_${docId}`);
    if (docData) {
      return JSON.parse(docData);
    }
  } catch (error) {
    console.error('Failed to retrieve document from localStorage:', error);
  }
  return null;
}

interface ApplicationCreateFormProps {
  onSave: (data: Omit<Application, 'id'>) => void;
  onCancel: () => void;
  scholarships: Scholarship[];
}

const REQUIRED_FIELDS = ["firstName", "lastName", "birthdate", "gender", "mobileNumber", "region", "city", "email", "schoolSector", "scholarship", "amount", "gwa", "submittedDate", "documents"]; // Updated to include new required fields

const ApplicationCreateForm = forwardRef(function ApplicationCreateForm({ onSave, onCancel, scholarships }: ApplicationCreateFormProps, ref) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(ApplicationCreateSchema),
    defaultValues: {
      name: "",
      firstName: "",
      middleName: "",
      lastName: "",
      birthdate: "",
      gender: undefined,
      mobileNumber: "",
      region: "",
      city: "",
      email: "",
      schoolSector: undefined,
      scholarship: "",
      amount: "",
      gwa: 0,
      status: "pending" as const,
      submittedDate: "", // Will be set after mount to prevent hydration issues
      documents: [],
      score: null,
    },
    mode: "onChange", // Enable real-time validation
  })

  // Set today's date after mount to prevent hydration issues
  useEffect(() => {
    if (isMounted) {
      const today = new Date().toISOString().split('T')[0];
      form.setValue('submittedDate', today);
    }
  }, [isMounted, form]);

  useImperativeHandle(ref, () => ({
    isDirty: () => {
      const values = form.getValues();
      return REQUIRED_FIELDS.some(field => {
        const value = values[field as keyof typeof values];
        if (field === 'documents') {
          return value && Array.isArray(value) && value.length > 0;
        }
        return value && (typeof value === 'string' ? value.trim() : value !== null && value !== undefined);
      });
    }
  }), [form]);

  // Remove manual validation state since Zod handles it
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // City dropdown state
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const selectedProvince = form.watch("region");
  const selectedScholarship = form.watch("scholarship");
  const currentGwa = form.watch("gwa");
  
  // GWA validation message
  const [gwaWarning, setGwaWarning] = useState<string | null>(null);
  
  useEffect(() => {
    if (currentGwa !== null && currentGwa !== undefined && currentGwa < 60) {
      setGwaWarning("GWA below 60% may not meet minimum scholarship requirements.");
    } else {
      setGwaWarning(null);
    }
  }, [currentGwa]);
  
  // Document upload state
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  
  // Update available cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      const cities = getCitiesForProvince(selectedProvince);
      setAvailableCities(cities);
      // Reset city selection when province changes
      form.setValue("city", "");
    } else {
      setAvailableCities([]);
      form.setValue("city", "");
    }
  }, [selectedProvince, form]);
  
  // Update amount when scholarship changes
  useEffect(() => {
    if (selectedScholarship) {
      const amount = getAmountForScholarship(selectedScholarship);
      if (amount) {
        form.setValue("amount", amount);
      }
    }
  }, [selectedScholarship, form]);

  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder-user.jpg");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 30 * 1024 * 1024; // 30MB
  const [editingCurrentAvatar, setEditingCurrentAvatar] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Enhanced Zod validation
      const validation = AvatarUploadSchema.safeParse({ file });
      if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message).join(', ');
        setAvatarError(errors);
        setNewAvatarFile(null);
        return;
      }
      
      setNewAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCroppingImage(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setNewAvatarFile(null);
    setAvatarUrl("/placeholder-user.jpg");
  };

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  async function getCroppedImg(imageSrc: string, crop: any) {
    const createImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', error => reject(error));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg');
    });
  }

  const handleEditAvatar = () => {
    setAvatarError(null);
    setEditingCurrentAvatar(true);
    setCroppingImage(avatarUrl);
    setCropModalOpen(true);
  };

  const handleCropConfirm = async () => {
    if (!croppingImage || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: croppedBlob.type || 'image/jpeg' });
      const formData = new FormData();
      formData.append('avatar', croppedFile);
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.url);
        setCropModalOpen(false);
        setCroppingImage(null);
        setNewAvatarFile(null);
        setEditingCurrentAvatar(false);
      } else {
        setAvatarError('Failed to upload avatar.');
      }
    } catch (err) {
      setAvatarError('Failed to crop/upload avatar.');
    } finally {
      setLoading(false);
    }
  };
  
  // Document upload handlers
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentError(null);
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const totalFiles = uploadedDocuments.length + newFiles.length;
    
    if (totalFiles > 5) {
      setDocumentError('Maximum 5 documents allowed');
      return;
    }
    
    // Validate with Zod schema
    const validation = ApplicationDocumentUploadSchema.safeParse({ files: [...uploadedDocuments, ...newFiles] });
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message).join(', ');
      setDocumentError(errors);
      return;
    }
    
    setUploadedDocuments(prev => [...prev, ...newFiles]);
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  }, [uploadedDocuments]);
  
  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    setDocumentError(null);
  };
  
  const uploadDocuments = async (): Promise<string[]> => {
    if (uploadedDocuments.length === 0) return [];
    
    setUploading(true);
    try {
      // Store documents in localStorage for now
      const documentUrls: string[] = [];
      
      for (let i = 0; i < uploadedDocuments.length; i++) {
        const file = uploadedDocuments[i];
        
        // Convert file to base64 for localStorage
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Create a unique identifier for the document
        const docId = `doc_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store in localStorage
        const docData = {
          id: docId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          uploadedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`document_${docId}`, JSON.stringify(docData));
        
        // Return the document ID as the "URL"
        documentUrls.push(docId);
      }
      
      return documentUrls;
    } catch (error) {
      setDocumentError(`Document upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };



  async function onSubmit(values: ApplicationFormData) {
    console.log('Form submission started', values);
    setIsSubmitting(true);
    try {
      // Upload documents first
      let documentUrls: string[] = [];
      try {
        documentUrls = await uploadDocuments();
        console.log('Documents uploaded successfully:', documentUrls);
      } catch (error) {
        console.error('Document upload failed:', error);
        // Don't stop form submission if document upload fails
        setDocumentError('Document upload failed, but form will still be submitted');
      }
      
      const computedName = [values.firstName, values.middleName, values.lastName]
        .filter(Boolean)
        .join(' ');
      
      const submitData = { 
        ...values, 
        name: values.name || computedName, 
        avatar: avatarUrl,
        documents: documentUrls
      };
      
      console.log('Calling onSave with:', submitData);
      await onSave(submitData);
      console.log('Form submission completed successfully');
    } catch (error) {
      console.error('Form submission failed:', error);
      // Don't throw the error, just log it to prevent form from breaking
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  // Prevent hydration mismatches
  if (!isMounted) {
    return (
      <div className="space-y-4 w-full">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" onClick={(e) => e.stopPropagation()}>
        {/* Form Completion Progress */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Color Picker for Application Details */}
              <input 
                type="color" 
                className="w-6 h-6 rounded border cursor-pointer" 
                defaultValue="#7C3AED" 
                title="Choose theme color for application details"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--application-theme-color', e.target.value);
                }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Completion</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {(() => {
                const formValues = form.getValues();
                const requiredFields = REQUIRED_FIELDS;
                const completedFields = requiredFields.filter(field => {
                  const value = formValues[field as keyof typeof formValues];
                  if (field === 'documents') {
                    return uploadedDocuments.length > 0;
                  }
                  return value && (typeof value === 'string' ? value.trim() : value !== null && value !== undefined);
                }).length;
                const percentage = Math.round((completedFields / requiredFields.length) * 100);
                return `${completedFields}/${requiredFields.length} (${percentage}%)`;
              })()}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(() => {
                  const formValues = form.getValues();
                  const requiredFields = REQUIRED_FIELDS;
                  const completedFields = requiredFields.filter(field => {
                    const value = formValues[field as keyof typeof formValues];
                    if (field === 'documents') {
                      return uploadedDocuments.length > 0;
                    }
                    return value && (typeof value === 'string' ? value.trim() : value !== null && value !== undefined);
                  }).length;
                  return (completedFields / requiredFields.length) * 100;
                })()}%` 
              }}
            />
          </div>
        </div>

        
        <div className="flex items-center space-x-4 mb-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
          <div>
            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              {avatarUrl === "/placeholder-user.jpg" ? 'Add Photo' : 'Change Photo'}
            </Button>
            <Input ref={fileInputRef} id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            <p className="text-xs text-muted-foreground mt-1">JPG, GIF, PNG, WEBP. {formatFileSize(maxSize)} max.</p>
            {avatarError && <p className="text-sm text-destructive mt-1">{avatarError}</p>}
            {avatarUrl !== "/placeholder-user.jpg" && (
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleRemoveAvatar} disabled={loading}>Remove Photo</Button>
                <Button variant="secondary" size="sm" onClick={handleEditAvatar} disabled={loading}>Edit Photo</Button>
              </div>
            )}
            {loading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
          </div>
        </div>
        <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
          <DialogContent className="max-w-lg w-full p-6 rounded-xl">
            <DialogHeader>
              <DialogTitle>Crop your avatar</DialogTitle>
            </DialogHeader>
            {croppingImage && (
              <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                <Cropper
                  image={croppingImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            <div className="flex gap-4 items-center mt-4">
              <span className="text-sm">Zoom</span>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="flex-1" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCropModalOpen(false); setCroppingImage(null); setEditingCurrentAvatar(false); }}>Cancel</Button>
              <Button variant="purple" onClick={handleCropConfirm} disabled={loading}>{loading ? 'Saving...' : 'Save Avatar'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField name="firstName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter first name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="middleName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter middle name (optional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="lastName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Last Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter last name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField name="birthdate" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Birthdate <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="date" placeholder="Select birthdate" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="gender" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Gender <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="mobileNumber" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Mobile Number <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="Enter mobile number (e.g., 09270122300)" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="region" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Province <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={!field.value ? "border-red-300 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Palawan">Palawan</SelectItem>
                  <SelectItem value="Mindoro Occidental">Mindoro Occidental</SelectItem>
                  <SelectItem value="Mindoro Oriental">Mindoro Oriental</SelectItem>
                  <SelectItem value="Marinduque">Marinduque</SelectItem>
                  <SelectItem value="Romblon">Romblon</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="city" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              City <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProvince || availableCities.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedProvince ? "Select City" : "Select Province first"} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Email <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter email address" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="schoolSector" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              School Sector <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="scholarship" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Scholarship <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value} required>
                <SelectTrigger className={!field.value ? "border-red-300 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select a scholarship" />
                </SelectTrigger>
                <SelectContent>
                  {scholarships.map((sch) => (
                    <SelectItem key={sch.id} value={sch.name}>
                      {sch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {!field.value && form.formState.isSubmitted && (
              <FormMessage>Please fill out this field</FormMessage>
            )}
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="amount" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Amount <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 select-none pointer-events-none">₱</span>
                <Input
                  {...field}
                  type="number"
                  className="pl-7 bg-gray-50"
                  placeholder="Auto-filled based on scholarship"
                  required
                  readOnly
                  value={field.value?.replace(/^₱\s*/, "")}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="gwa" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              GWA <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                <Input 
                  {...field} 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="100"
                  placeholder="Enter GWA percentage (e.g., 90.0)"
                  required
                  value={field.value !== null ? field.value : ''} 
                  onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} 
                />
                <span className="absolute right-3 text-gray-500 select-none pointer-events-none">%</span>
              </div>
            </FormControl>
            {gwaWarning && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                  <p className="text-sm text-orange-700">{gwaWarning}</p>
                </div>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Status <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="submittedDate" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Submitted Date <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="date" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        {/* Document Upload Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
            Upload Documents <span className="text-red-500">*</span>
          </Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
              isDragging 
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/30' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {isDragging ? (
                <div className="animate-pulse">
                  <Upload className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                  <p className="text-purple-600 font-medium">Drop your files here</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        documentInputRef.current?.click();
                      }}
                      disabled={uploading || uploadedDocuments.length >= 5}
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={documentInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.odt"
                      onChange={handleDocumentChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    <strong>Drag & drop files here</strong> or click Choose Files<br/>
                    PDF, DOCX, DOC, ODT files only. Max 5 files, 30MB total.
                  </p>
                </>
              )}
            </div>
            
            {uploadedDocuments.length > 0 && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Selected Files ({uploadedDocuments.length}/5):
                </h4>
                <div className="space-y-2">
                  {uploadedDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          {formatFileSize(file.size)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeDocument(index);
                          }}
                          disabled={uploading}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {documentError && (
              <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-950/30">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-400">{documentError}</AlertDescription>
              </Alert>
            )}
            
            {uploading && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <p className="text-sm text-gray-600">Saving documents to local storage...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2 pt-4">
          <Button 
            type="submit" 
            variant="purple" 
            className="flex-1" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Application"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCancel(e);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
});

export default ApplicationCreateForm; 