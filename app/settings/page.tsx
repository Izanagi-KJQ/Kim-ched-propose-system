"use client";
import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const [notifications, setNotifications] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/placeholder-user.jpg");
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
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) {
      setAvatarPreview(savedAvatar);
    }
    const savedNotifications = localStorage.getItem('user-notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
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
    setAvatarPreview(defaultAvatar);
    localStorage.setItem('user-avatar', defaultAvatar);
  };

  const handleSaveSettings = async () => {
    let avatarUrl = avatarPreview;
    if (newAvatarFile) {
      // Upload the file to the mock backend
      const formData = new FormData();
      formData.append('avatar', newAvatarFile);
      try {
        const res = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          avatarUrl = data.url;
          setAvatarPreview(avatarUrl);
          localStorage.setItem('user-avatar', avatarUrl);
        } else {
          setAvatarError('Failed to upload avatar.');
        }
      } catch (err) {
        setAvatarError('Failed to upload avatar.');
      }
    } else {
      // No new file, just save the current preview (for demo)
      localStorage.setItem('user-avatar', avatarUrl);
    }
    localStorage.setItem('user-notifications', JSON.stringify(notifications));
    if (newPassword) {
      // In a real app, you would make an API call to update the password.
      // For this demo, we'll just show a toast and clear the field.
      localStorage.setItem('user-password', newPassword); // For demo only, NOT SECURE
      setNewPassword("");
    }
    toast.success("Settings have been saved successfully!");
  };

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  async function getCroppedImg(imageSrc: string, crop: any) {
    // Utility to crop image in browser
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
    setCroppingImage(avatarPreview);
    setCropModalOpen(true);
  };

  const handleCropConfirm = async () => {
    if (!croppingImage || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      // Convert Blob to File with a name and type
      const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: croppedBlob.type || 'image/jpeg' });
      const formData = new FormData();
      formData.append('avatar', croppedFile);
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarPreview(data.url);
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

  // Listen for avatar changes in other tabs/windows
  useEffect(() => {
    const syncAvatar = () => {
      const savedAvatar = localStorage.getItem('user-avatar');
      if (savedAvatar) setAvatarPreview(savedAvatar);
    };
    window.addEventListener('storage', syncAvatar);
    return () => window.removeEventListener('storage', syncAvatar);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
                {avatarPreview === defaultAvatar ? 'Add Photo' : 'Change Photo'}
              </Button>
              <Input ref={fileInputRef} id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <p className="text-xs text-muted-foreground mt-1">JPG, GIF, PNG, WEBP. 30MB max.</p>
              {avatarError && <p className="text-sm text-destructive mt-1">{avatarError}</p>}
              {avatarPreview !== defaultAvatar && (
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleRemoveAvatar} disabled={loading}>Remove Photo</Button>
                  <Button variant="secondary" size="sm" onClick={handleEditAvatar} disabled={loading}>Edit Photo</Button>
                </div>
              )}
              {loading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Email Notifications</Label>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Change Password</Label>
            <Input id="password" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} variant="purple">Save Settings</Button>
        </CardFooter>
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