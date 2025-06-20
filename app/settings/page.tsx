"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/placeholder-user.jpg");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

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
      if (file.size > 25 * 1024 * 1024) {
        setAvatarError("File is too large. Max size is 25MB.");
        setNewAvatarFile(null);
        return;
      }
      setNewAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = () => {
    if (newAvatarFile) {
      // In a real app, you would upload the file to a server.
      // Here, we'll just save the blob URL to localStorage for demo purposes.
      localStorage.setItem('user-avatar', avatarPreview);
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
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button>Change Photo</Button>
              </Label>
              <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. 25MB max.</p>
              {avatarError && <p className="text-sm text-destructive mt-1">{avatarError}</p>}
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
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 