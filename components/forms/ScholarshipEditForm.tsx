import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scholarship } from "@/lib/types";

interface ScholarshipEditFormProps {
  scholarship: Scholarship;
  onSave: (data: Scholarship) => void;
  onCancel: () => void;
}

export default function ScholarshipEditForm({ scholarship, onSave, onCancel }: ScholarshipEditFormProps) {
  const form = useForm<Omit<Scholarship, 'id'>>({
    defaultValues: {
      name: scholarship.name,
      amount: scholarship.amount.replace('$', '').replace('₱', '').replace(/,/g, '').trim(),
      deadline: scholarship.deadline,
      status: scholarship.status,
      applicants: scholarship.applicants,
    },
  })

  function onSubmit(values: Omit<Scholarship, 'id'>) {
    onSave({ ...scholarship, ...values, amount: `$${values.amount}` }) // Add '$' back on save
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
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
        <FormField name="deadline" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Deadline</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Save</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
} 