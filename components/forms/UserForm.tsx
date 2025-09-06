import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/lib/types";
import { UserFormSchema, type UserFormData } from "@/lib/validations";
import { useState, useEffect } from "react";

interface UserFormProps {
  user?: User;
  onSave: (user: UserFormData) => void;
  onCancel: () => void;
  currentUserRole?: string; // For role-based restrictions
}

export default function UserForm({ user, onSave, onCancel, currentUserRole }: UserFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isAdministrator = currentUserRole === "Administrator";
  const isEditing = !!user;

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: (user?.role as "Administrator" | "Staff" | "Viewer") || "Staff",
      department: user?.department || "",
      status: (user?.status as "active" | "inactive") || "active",
      lastActive: user?.lastActive ? new Date(user.lastActive).toISOString().slice(0, 16) : "",
    },
  });
  function onSubmit(values: UserFormData) {
    // Prevent submission if not properly mounted
    if (!isMounted) return;
    
    // Format the data for submission
    const submissionData: UserFormData = {
      ...values,
      // Ensure status is lowercase for consistency with API
      status: values.status.toLowerCase() as "active" | "inactive",
    };
    
    onSave(submissionData);
  }
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <FormField name="firstName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              First Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter first name"
                maxLength={50}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="middleName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Middle Name</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter middle name (optional)"
                maxLength={50}
              />
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
              <Input 
                {...field} 
                placeholder="Enter last name"
                maxLength={50}
              />
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
              <Input 
                {...field} 
                type="email" 
                placeholder="user@example.com"
                autoComplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="role" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Role <span className="text-red-500">*</span>
              {!isAdministrator && (
                <span className="text-xs text-muted-foreground">(Administrator access required to change)</span>
              )}
            </FormLabel>
            <FormControl>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={!isAdministrator}
              >
                <SelectTrigger className={`w-full ${!isAdministrator ? 'opacity-60' : ''}`}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="department" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Department <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter department"
                maxLength={100}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {isEditing && (
          <FormField name="lastActive" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Last Active</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="datetime-local" 
                  disabled
                  className="opacity-60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Status <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2 pt-4">
          <Button 
            type="submit" 
            variant="purple" 
            className="flex-1"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={handleCancel}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
} 