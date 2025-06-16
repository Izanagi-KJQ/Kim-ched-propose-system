import React from 'react';

interface RequirementsChecklistProps {
  requirements: string[];
  validated: Record<string, boolean>;
  onValidate: (req: string, value: boolean) => void;
}

const RequirementsChecklist: React.FC<RequirementsChecklistProps> = ({ requirements, validated, onValidate }) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">Requirements</h4>
      <ul className="space-y-2">
        {requirements.map((req) => (
          <li key={req} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!validated[req]}
              onChange={e => onValidate(req, e.target.checked)}
              className="accent-purple-600 w-4 h-4 rounded border-gray-300"
            />
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequirementsChecklist; 