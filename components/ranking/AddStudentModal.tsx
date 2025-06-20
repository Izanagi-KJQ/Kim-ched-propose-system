import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (student: any) => void;
  scholarships: { id: string; name: string; requirements: string[] }[];
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ open, onClose, onAdd, scholarships }) => {
  const [name, setName] = useState('');
  const [gpa, setGpa] = useState('');
  const [scholarship, setScholarship] = useState(scholarships[0]?.name || '');
  const [requirements, setRequirements] = useState<Record<string, { valid: boolean; falseDoc: boolean }>>({});

  const selectedScholarship = scholarships.find(s => s.name === scholarship);
  const reqList = selectedScholarship?.requirements || [];

  useEffect(() => {
    // Reset requirements when scholarship changes
    const newReqs: Record<string, { valid: boolean; falseDoc: boolean }> = {};
    reqList.forEach(req => {
      newReqs[req] = { valid: false, falseDoc: false };
    });
    setRequirements(newReqs);
  }, [scholarship]);

  const handleReqChange = (req: string, checked: boolean) => {
    setRequirements(prev => ({ ...prev, [req]: { ...prev[req], valid: checked } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gpa || !scholarship) {
      // Basic validation
      return;
    }
    onAdd({
      id: `APP${Date.now()}`, // More consistent ID
      name,
      gpa: parseFloat(gpa),
      scholarship,
      requirements, // Pass the new requirements structure
      status: 'pending',
      avatar: '/placeholder.svg',
    });
    onClose();
    // Reset form
    setName('');
    setGpa('');
    setScholarship(scholarships[0]?.name || '');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Student to Reserve List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gpa" className="text-right">
              GPA
            </Label>
            <Input id="gpa" type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scholarship" className="text-right">
              Scholarship
            </Label>
            <Select value={scholarship} onValueChange={setScholarship}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a scholarship" />
              </SelectTrigger>
              <SelectContent>
                {scholarships.map(s => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-semibold mb-2 block text-center">Requirements Submitted</Label>
            <div className="flex flex-col gap-3 p-2 rounded-md border">
              {reqList.map(req => (
                <div key={req} className="flex items-center gap-2">
                  <Checkbox
                    id={`req-${req}`}
                    checked={requirements[req]?.valid || false}
                    onCheckedChange={checked => handleReqChange(req, !!checked)}
                  />
                  <Label htmlFor={`req-${req}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {req}
                  </Label>
                </div>
              ))}
              {reqList.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">Select a scholarship to see requirements.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal; 