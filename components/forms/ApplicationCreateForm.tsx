import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application, Scholarship } from "@/lib/types";
import { useState, useRef } from "react";
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface ApplicationCreateFormProps {
  onSave: (data: Omit<Application, 'id'>) => void;
  onCancel: () => void;
  scholarships: Scholarship[];
}

export default function ApplicationCreateForm({ onSave, onCancel, scholarships }: ApplicationCreateFormProps) {
  const form = useForm<Omit<Application, 'id' | 'avatar'>>({
    defaultValues: {
      name: "",
      region: "",
      email: "",
      scholarship: "",
      amount: "",
      gpa: 0,
      status: "pending",
      submittedDate: "",
      score: null,
    },
  })

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

  function onSubmit(values: Omit<Application, 'id' | 'avatar'>) {
    onSave({ ...values, avatar: avatarUrl });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Applicant Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="region" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Province</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Change Province" />
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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="scholarship" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Scholarship</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
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
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="amount" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 select-none pointer-events-none">₱</span>
                <Input
                  {...field}
                  type="number"
                  className="pl-7"
                  placeholder="₱ 0.00"
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
            <FormLabel>GPA</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" value={field.value !== null ? field.value : ''} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
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
            <FormLabel>Submitted Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" variant="purple" className="flex-1">Create Application</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
} 