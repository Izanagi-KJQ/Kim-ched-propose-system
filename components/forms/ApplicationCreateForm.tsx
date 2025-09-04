import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application, Scholarship } from "@/lib/types";
import { ApplicationCreateSchema, type ApplicationFormData } from "@/lib/validations";
import { useState, useRef } from "react";
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import React, { useImperativeHandle, forwardRef } from "react";

interface ApplicationCreateFormProps {
  onSave: (data: Omit<Application, 'id'>) => void;
  onCancel: () => void;
  scholarships: Scholarship[];
}

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "region", "scholarship", "amount", "gpa", "submittedDate"];

const ApplicationCreateForm = forwardRef(function ApplicationCreateForm({ onSave, onCancel, scholarships }: ApplicationCreateFormProps, ref) {
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(ApplicationCreateSchema),
    defaultValues: {
      name: "",
      firstName: "",
      middleName: "",
      lastName: "",
      birthdate: "",
      region: "",
      email: "",
      scholarship: "",
      amount: "",
      gpa: 0,
      status: "pending" as const,
      submittedDate: "",
      score: null,
    },
    mode: "onChange", // Enable real-time validation
  })

  useImperativeHandle(ref, () => ({
    isDirty: () => {
      const values = form.getValues();
      return REQUIRED_FIELDS.some(field => {
        const value = values[field as keyof typeof values];
        return value && (typeof value === 'string' ? value.trim() : value !== null && value !== undefined);
      });
    }
  }), [form]);

  // Remove manual validation state since Zod handles it
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (!acceptedTypes.includes(file.type)) {
        setAvatarError("Only JPG, PNG, GIF, or WEBP images are allowed.");
        setNewAvatarFile(null);
        return;
      }
      if (file.size > maxSize) {
        setAvatarError("File is too large. Max size is 30MB.");
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



  function onSubmit(values: ApplicationFormData) {
    setIsSubmitting(true);
    try {
      const computedName = [values.firstName, values.middleName, values.lastName]
        .filter(Boolean)
        .join(' ');
      onSave({ ...values, name: values.name || computedName, avatar: avatarUrl });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" onClick={(e) => e.stopPropagation()}>
        {/* Form Completion Progress */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Completion</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {(() => {
                const formValues = form.getValues();
                const requiredFields = ['firstName', 'lastName', 'email', 'region', 'scholarship', 'amount', 'gpa', 'submittedDate'];
                const completedFields = requiredFields.filter(field => {
                  const value = formValues[field as keyof typeof formValues];
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
                  const requiredFields = ['firstName', 'lastName', 'email', 'region', 'scholarship', 'amount', 'gpa', 'submittedDate'];
                  const completedFields = requiredFields.filter(field => {
                    const value = formValues[field as keyof typeof formValues];
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
            <p className="text-xs text-muted-foreground mt-1">JPG, GIF, PNG, WEBP. 30MB max.</p>
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
            <FormLabel>Birthdate</FormLabel>
            <FormControl>
              <Input {...field} type="date" placeholder="Select birthdate (optional)" />
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
                  className="pl-7"
                  placeholder="₱ 0.00"
                  required
                  value={field.value?.replace(/^₱\s*/, "")}
                  onChange={e => field.onChange(e.target.value)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="gpa" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              GPA <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                step="0.01" 
                min="0"
                max="5"
                placeholder="0.00 - 5.00"
                required
                value={field.value !== null ? field.value : ''} 
                onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} 
              />
            </FormControl>
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
        <div className="flex space-x-2">
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
            onClick={handleCancel}
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