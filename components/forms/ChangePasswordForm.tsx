import { useState } from "react";
import { User } from "@/lib/types";

interface ChangePasswordFormProps {
  user: User;
  onCancel: () => void;
}

export default function ChangePasswordForm({ user, onCancel }: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !retypePassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== retypePassword) {
      setError('New passwords do not match.');
      return;
    }
    // Simulate password change
    console.log(`Password for ${user.name} changed successfully.`);
    setSuccess('Password changed successfully!');
    setTimeout(onCancel, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Old Password</label>
        <input type="password" className="w-full border rounded p-2" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required placeholder="Enter old password" />
      </div>
      <div>
        <label className="block font-medium mb-1">New Password</label>
        <input type="password" className="w-full border rounded p-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" />
      </div>
      <div>
        <label className="block font-medium mb-1">Re-type Password</label>
        <input type="password" className="w-full border rounded p-2" value={retypePassword} onChange={e => setRetypePassword(e.target.value)} required placeholder="Re-type new password" />
      </div>
      {error && <div className="text-red-600 dark:text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 dark:text-green-500 text-sm">{success}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="flex-1 bg-black text-white rounded p-2" disabled={!oldPassword || !newPassword || !retypePassword || newPassword !== retypePassword}>Confirm</button>
        <button type="button" className="flex-1 border rounded p-2" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
} 