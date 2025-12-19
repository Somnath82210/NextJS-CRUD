'use client';

import { useState, useRef, useEffect } from 'react';
import {ExportToCSV} from './ExportCSV';
import { ExportToExcel } from './ExportExcel';
import { ExportDropdownProps } from './types';

export default function ExportDropdown<T extends Record<string, any>>({
  data,
  headers,
  filename,
  buttonText = 'Export',
  variant = 'success',
  className,
}: ExportDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    success: 'bg-green-600 hover:bg-green-700',
  };

  const getButtonClasses = () => {
    if (className) return className;
    return `px-4 py-2 ${variantClasses[variant]} text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`;
  };

  const handleExportComplete = () => {
    setIsOpen(false);
  };

  const baseFilename = filename || `export_${new Date().toISOString().split('T')[0]}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonClasses()}
        type="button"
        disabled={!data || data.length === 0}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {buttonText}
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && data && data.length > 0 && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <ExportToCSV
            data={data}
            headers={headers}
            filename={baseFilename.replace(/\.(csv|xlsx)$/i, '') + '.csv'}
            onExportComplete={handleExportComplete}
          />
          <ExportToExcel
            data={data}
            headers={headers}
            filename={baseFilename.replace(/\.(csv|xlsx)$/i, '') + '.xlsx'}
            onExportComplete={handleExportComplete}
          />
        </div>
      )}
    </div>
  );
}