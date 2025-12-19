'use client';
import { ExportToExcelProps } from "./types"

export function ExportToExcel<T extends Record<string, any>>({
  data,
  headers,
  filename,
  onExportComplete,
}: ExportToExcelProps<T>) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      const worksheetData: any[][] = [];
      
      let dataHeaders: string[];
      let dataKeys: (keyof T)[];

      if (headers && headers.length > 0) {
        dataHeaders = headers.map((h) => h.label);
        dataKeys = headers.map((h) => h.key);
      } else {
        const firstItem = data[0];
        dataKeys = Object.keys(firstItem) as (keyof T)[];
        dataHeaders = dataKeys as string[];
      }
      worksheetData.push(dataHeaders);
      data.forEach(item => {
        const row = dataKeys.map(key => {
          const value = item[key];
          if (value === null || value === undefined) return '';
          return value;
        });
        worksheetData.push(row);
      });
      const xmlContent = createExcelXML(worksheetData);
      const blob = new Blob([xmlContent], { 
        type: 'application/vnd.ms-excel;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const defaultFilename = `export_${new Date().toISOString().split('T')[0]}.xlsx`;
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
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel file');
    }
  };

  const createExcelXML = (data: any[][]): string => {
    let xml = '<?xml version="1.0"?>\n';
    xml += '<?mso-application progid="Excel.Sheet"?>\n';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
    xml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
    xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
    xml += '<Worksheet ss:Name="Sheet1">\n';
    xml += '<Table>\n';

    data.forEach((row, rowIndex) => {
      xml += '<Row>\n';
      row.forEach(cell => {
        const cellValue = String(cell ?? '').replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        
        // Determine cell type
        const isNumber = typeof cell === 'number' || (!isNaN(Number(cell)) && cell !== '' && cell !== null);
        const cellType = isNumber ? 'Number' : 'String';
        
        if (rowIndex === 0) {
          // Header row with bold styling
          xml += `<Cell><Data ss:Type="String"><html:B>${cellValue}</html:B></Data></Cell>\n`;
        } else {
          xml += `<Cell><Data ss:Type="${cellType}">${cellValue}</Data></Cell>\n`;
        }
      });
      xml += '</Row>\n';
    });

    xml += '</Table>\n';
    xml += '</Worksheet>\n';
    xml += '</Workbook>';

    return xml;
  };

  return (
    <button
      onClick={handleExport}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
      type="button"
      disabled={!data || data.length === 0}
    >
      <svg className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      Export as Excel
    </button>
  );
}