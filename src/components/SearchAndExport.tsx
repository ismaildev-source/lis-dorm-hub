
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Download, Printer } from 'lucide-react';

interface SearchAndExportProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onPrint: () => void;
  placeholder?: string;
}

const SearchAndExport = ({ 
  searchTerm, 
  onSearchChange, 
  onExport, 
  onPrint,
  placeholder = "Search..." 
}: SearchAndExportProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 print:hidden">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onPrint} variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default SearchAndExport;
