'use client';
import { ExportToCSVProps } from './types';

export function ExportToCSV<T extends Record<string, any>>({
  data,
  headers,
  filename,
  onExportComplete,
}: ExportToCSVProps<T>) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      let csvHeaders: string[];
      let csvRows: string[][];

      if (headers && headers.length > 0) {
        csvHeaders = headers.map((h) => h.label);
        csvRows = data.map((item) =>
          headers.map((h) => {
            const value = item[h.key];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            if (typeof value === 'number') return value.toString();
            return `"${String(value).replace(/"/g, '""')}"`;
          })
        );
      } else {
        const firstItem = data[0];
        csvHeaders = Object.keys(firstItem);
        csvRows = data.map((item) =>
          csvHeaders.map((header) => {
            const value = item[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            if (typeof value === 'number') return value.toString();
            return `"${String(value).replace(/"/g, '""')}"`;
          })
        );
      }

      const csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const defaultFilename = `export_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename || defaultFilename);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV file');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
      type="button"
      disabled={!data || data.length === 0}
    >
      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export as CSV
    </button>
  );
}