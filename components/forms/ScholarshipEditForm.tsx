import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scholarship } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface ScholarshipEditFormProps {
  scholarship: Scholarship;
  onSave: (data: Scholarship) => void;
  onCancel: () => void;
}

export default function ScholarshipEditForm({ scholarship, onSave, onCancel }: ScholarshipEditFormProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    // Pad month and day
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  const form = useForm<Omit<Scholarship, 'id'>>({
    defaultValues: {
      name: scholarship.name,
      amount: scholarship.amount.replace('$', '').replace('₱', '').replace(/,/g, '').trim(),
      deadline: formatDate(scholarship.deadline),
      status: scholarship.status.toLowerCase(),
      applicants: scholarship.applicants,
    },
    mode: "onChange", // Enable real-time validation
  })

  // Add validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function to check for incomplete fields
  const validateForm = (values: Omit<Scholarship, 'id'>): string[] => {
    const errors: string[] = [];
    
    // Check required fields
    if (!values.name?.trim()) errors.push("Scholarship Name is required");
    if (!values.amount?.trim()) errors.push("Amount is required");
    if (!values.deadline?.trim()) errors.push("Deadline is required");
    if (!values.status?.trim()) errors.push("Status is required");
    
    // Check name length
    if (values.name && values.name.trim().length < 3) {
      errors.push("Scholarship Name must be at least 3 characters long");
    }
    
    // Check amount format
    if (values.amount && !/^\d+(\.\d{1,2})?$/.test(values.amount.replace(/[^\d.]/g, ''))) {
      errors.push("Please enter a valid amount");
    }
    
    // Check deadline (must be in the future)
    if (values.deadline) {
      const deadlineDate = new Date(values.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        errors.push("Deadline must be in the future");
      }
    }
    
    // Check applicants count
    if (values.applicants < 0) {
      errors.push("Applicants count cannot be negative");
    }
    
    return errors;
  };

  function onSubmit(values: Omit<Scholarship, 'id'>) {
    setIsSubmitting(true);
    setValidationErrors([]);
    
    // Validate form before submission
    const errors = validateForm(values);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    // Ensure status is lowercase and amount is formatted with only one $
    let formattedAmount = values.amount;
    if (!formattedAmount.startsWith('$')) formattedAmount = `$${formattedAmount}`;
    onSave({ ...scholarship, ...values, amount: formattedAmount, status: values.status.toLowerCase() });
    setIsSubmitting(false);
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Validation Errors Display */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Please fix the following errors:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-700">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
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
        <FormField name="status" control={form.control} render={({ field }) => {
          const currentStatus = form.watch("status");
          // Scholarship status workflow:
          // - If 'pending': disable 'Pending'
          // - If 'under_review': disable 'Pending', 'Under Review'
          // - If 'active' or 'closed': disable all except current
          return (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Status <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger className={!field.value ? "border-red-300 focus:border-red-500" : ""}>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" disabled={currentStatus === 'pending' || currentStatus === 'under_review' || currentStatus === 'active' || currentStatus === 'closed'}>Pending</SelectItem>
                    <SelectItem value="under_review" disabled={currentStatus === 'under_review' || currentStatus === 'active' || currentStatus === 'closed'}>Under Review</SelectItem>
                    <SelectItem value="active" disabled={currentStatus === 'active' || currentStatus === 'closed'}>Active</SelectItem>
                    <SelectItem value="closed" disabled={currentStatus === 'closed' || currentStatus === 'active'}>Closed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }} />
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
            {isSubmitting ? "Saving..." : "Save Changes"}
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