import React from 'react';
import { X } from 'lucide-react';

interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
  variant?: 'default' | 'offered' | 'wanted';
  size?: 'sm' | 'md';
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove, variant = 'default', size = 'md' }) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    offered: 'bg-green-100 text-green-800 hover:bg-green-200',
    wanted: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default SkillTag;