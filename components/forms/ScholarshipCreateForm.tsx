import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scholarship } from "@/lib/types";
import { ScholarshipCreateSchema, type ScholarshipFormData } from "@/lib/validations";
import { useState } from "react";

interface ScholarshipCreateFormProps {
  onSave: (data: Omit<Scholarship, 'id'>) => void;
  onCancel: () => void;
  type?: 'Full' | 'Half';
}

export default function ScholarshipCreateForm({ onSave, onCancel, type }: ScholarshipCreateFormProps) {
  const form = useForm<ScholarshipFormData>({
    resolver: zodResolver(ScholarshipCreateSchema),
    defaultValues: {
      name: "",
      amount: "",
      deadline: "",
      status: "active" as const, // Default status
      applicants: 0,
      type: type || 'Full',
    },
    mode: "onChange", // Enable real-time validation
  })

  // Remove manual validation state since Zod handles it
  const [isSubmitting, setIsSubmitting] = useState(false);



  function onSubmit(values: ScholarshipFormData) {
    setIsSubmitting(true);
    try {
      onSave({ ...values, type: type || 'Full' });
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
                const requiredFields = ['name', 'amount', 'deadline', 'status'];
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
                  const requiredFields = ['name', 'amount', 'deadline', 'status'];
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

        
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Scholarship Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter scholarship name"
                minLength={3}
                required 
              />
            </FormControl>
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
                  min="0"
                  step="0.01"
                  required
                  value={field.value?.replace(/^₱\s*/, "")}
                  onChange={e => field.onChange(e.target.value)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="deadline" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Deadline <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                min={new Date().toISOString().split('T')[0]}
                required
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
                <SelectTrigger className={!field.value ? "border-red-300 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="applicants" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Applicants</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                min="0"
                placeholder="0"
                onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
              />
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
            {isSubmitting ? "Creating..." : "Create Scholarship"}
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
} 