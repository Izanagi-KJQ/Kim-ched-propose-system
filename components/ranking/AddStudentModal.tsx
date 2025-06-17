import React, { useState } from 'react';

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
  const [requirements, setRequirements] = useState<Record<string, boolean>>({});

  const selectedScholarship = scholarships.find(s => s.name === scholarship);
  const reqList = selectedScholarship?.requirements || [];

  const handleReqChange = (req: string, checked: boolean) => {
    setRequirements(prev => ({ ...prev, [req]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now().toString(),
      name,
      gpa: parseFloat(gpa),
      scholarship,
      requirements,
      status: 'pending',
      avatar: '/placeholder.svg',
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
        <h3 className="text-xl font-bold mb-2">Add Student</h3>
        <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="GPA" type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} required />
        <select className="w-full border p-2 rounded" value={scholarship} onChange={e => setScholarship(e.target.value)}>
          {scholarships.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
        <div>
          <h4 className="font-semibold mb-2">Requirements</h4>
          <div className="flex flex-col gap-2">
            {reqList.map(req => (
              <label key={req} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!requirements[req]}
                  onChange={e => handleReqChange(req, e.target.checked)}
                  className="accent-purple-600 w-4 h-4 rounded border-gray-300"
                />
                {req}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="flex-1 bg-purple-600 text-white rounded p-2">Add</button>
          <button type="button" className="flex-1 border rounded p-2" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentModal; 