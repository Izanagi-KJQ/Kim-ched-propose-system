import React from 'react';

interface RequirementsChecklistProps {
  requirements: string[];
  validated: Record<string, { valid: boolean; falseDoc: boolean }>;
  onValidate: (req: string, value: { valid: boolean; falseDoc: boolean }) => void;
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
              checked={!!validated[req]?.valid}
              onChange={e => onValidate(req, { valid: e.target.checked, falseDoc: validated[req]?.falseDoc || false })}
              className="accent-purple-600 w-4 h-4 rounded border-gray-300"
            />
            <span>{req}</span>
            <label className="flex items-center gap-1 ml-2 text-xs text-red-600">
              <input
                type="checkbox"
                checked={!!validated[req]?.falseDoc}
                onChange={e => onValidate(req, { valid: validated[req]?.valid || false, falseDoc: e.target.checked })}
                className="accent-red-600 w-3 h-3 rounded border-gray-300"
              />
              <span>False</span>
              {validated[req]?.falseDoc && <span title="Marked as false document">🚩</span>}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequirementsChecklist; 