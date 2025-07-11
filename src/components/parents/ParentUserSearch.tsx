
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ParentUserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ParentUserSearch: React.FC<ParentUserSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search parents..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ParentUserSearch;
