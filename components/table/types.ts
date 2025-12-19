
export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  width?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DynamicTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  className?: string;
  emptyMessage?: string;
  hoverable?: boolean;
  striped?: boolean;
  itemsPerPage?: number; 
  showPagination?: boolean; 
  alwaysShowPagination: boolean;
}
