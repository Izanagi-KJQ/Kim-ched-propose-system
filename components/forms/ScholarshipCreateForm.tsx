import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scholarship } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ScholarshipCreateFormProps {
  onSave: (data: Omit<Scholarship, 'id'>) => void;
  onCancel: () => void;
  type?: 'Full' | 'Half';
}

export default function ScholarshipCreateForm({ onSave, onCancel, type }: ScholarshipCreateFormProps) {
  const form = useForm<Omit<Scholarship, 'id'>>({
    defaultValues: {
      name: "",
      amount: "",
      deadline: "",
      status: "active", // Default status
      applicants: 0,
      type: type || 'Full',
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
    
    onSave({ ...values, type: type || 'Full' });
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
} 