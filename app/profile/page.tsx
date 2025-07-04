"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import ProtectedRoute from "@/components/ProtectedRoute";
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useRef } from "react";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultAvatar = "/placeholder-user.jpg";
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingCurrentAvatar, setEditingCurrentAvatar] = useState(false);

  const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 30 * 1024 * 1024; // 30MB

  useEffect(() => {
    const savedName = localStorage.getItem("user-name");
    const savedEmail = localStorage.getItem("user-email");
    const savedAvatar = localStorage.getItem("user-avatar");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, []);

  // Listen for avatar changes in other tabs/windows
  useEffect(() => {
    const syncAvatar = () => {
      const savedAvatar = localStorage.getItem('user-avatar');
      if (savedAvatar) setAvatarUrl(savedAvatar);
    };
    window.addEventListener('storage', syncAvatar);
    return () => window.removeEventListener('storage', syncAvatar);
  }, []);

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
    setAvatarUrl(defaultAvatar);
    localStorage.setItem('user-avatar', defaultAvatar);
    window.dispatchEvent(new Event('storage'));
  };

  const handleEditAvatar = () => {
    setAvatarError(null);
    setEditingCurrentAvatar(true);
    setCroppingImage(avatarUrl);
    setCropModalOpen(true);
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
        localStorage.setItem('user-avatar', data.url);
        window.dispatchEvent(new Event('storage'));
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

  const handleSaveChanges = () => {
    localStorage.setItem("user-name", name);
    localStorage.setItem("user-email", email);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
                {avatarUrl === defaultAvatar ? 'Add Photo' : 'Change Photo'}
              </Button>
              <Input ref={fileInputRef} id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <p className="text-xs text-muted-foreground mt-1">JPG, GIF, PNG, WEBP. 30MB max.</p>
              {avatarError && <p className="text-sm text-destructive mt-1">{avatarError}</p>}
              {avatarUrl !== defaultAvatar && (
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleRemoveAvatar} disabled={loading}>Remove Photo</Button>
                  <Button variant="secondary" size="sm" onClick={handleEditAvatar} disabled={loading}>Edit Photo</Button>
                </div>
              )}
              {loading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>
      {/* Cropping Modal */}
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
            <Button onClick={handleCropConfirm} disabled={loading}>{loading ? 'Saving...' : 'Save Avatar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 