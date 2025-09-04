import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Application } from "@/lib/types";

interface ApplicationReviewFormProps {
  application: Application;
  onSave: (data: { score: number | null, status: string, review: string }) => void;
  onCancel: () => void;
}

export default function ApplicationReviewForm({ application, onSave, onCancel }: ApplicationReviewFormProps) {
  const form = useForm<{ score: number | null, status: string, review: string }>({ // Update type
    defaultValues: {
      review: application.review || "", // Initialize with existing review
      status: application.status, // Initialize with existing status
      score: application.score || null
    },
  })

  function onSubmit(values: { score: number | null, status: string, review: string }) {
    onSave(values)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" onClick={(e) => e.stopPropagation()}>
        <FormField name="status" control={form.control} render={({ field }) => {
          // Determine which options to disable
          const currentStatus = application.status;
          const isPending = currentStatus === 'pending';
          const isUnderReview = currentStatus === 'under_review';
          const isFinal = currentStatus === 'approved' || currentStatus === 'rejected';
          return (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFinal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" disabled={isPending || isUnderReview || isFinal}>Pending</SelectItem>
                    <SelectItem value="under_review" disabled={isUnderReview || isFinal}>Under Review</SelectItem>
                    <SelectItem value="approved" disabled={isFinal}>Approved</SelectItem>
                    <SelectItem value="rejected" disabled={isFinal}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }} />
        <FormField name="review" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Review Comments</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" variant="purple" className="flex-1">Save Review</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
} 