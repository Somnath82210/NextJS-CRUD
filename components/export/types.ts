//dropdown export
export interface ExportHeader<T> {
  key: keyof T;
  label: string;
}

export interface ExportDropdownProps<T> {
  data: T[];
  headers?: ExportHeader<T>[];
  filename?: string;
  buttonText?: string;
  variant?: 'primary' | 'success' | 'secondary';
  className?: string;
}

//excel export 

export interface ExportToExcelProps<T> {
  data: T[];
  headers?: ExportHeader<T>[];
  filename?: string;
  onExportComplete?: () => void;
}

//csv export

export interface ExportToCSVProps<T> {
  data: T[];
  headers?: ExportHeader<T>[];
  filename?: string;
  onExportComplete?: () => void;
}
