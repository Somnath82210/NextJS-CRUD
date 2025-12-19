'use client';

import { useState, useMemo, useCallback } from 'react';
import { SortConfig, DynamicTableProps, TableColumn } from './types';

export default function DynamicTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  hoverable = true,
  striped = true,
  itemsPerPage = 10, 
  showPagination = false,
  alwaysShowPagination = false
}: DynamicTableProps<T>) {
  
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1); 

  // Sorting Logic
  const handleSort = useCallback((key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key] as string | number;
      const bVal = b[sortConfig.key] as string | number;
      if (aVal === bVal) return 0;
      const comp = aVal > bVal ? 1 : -1;
      return sortConfig.direction === 'asc' ? comp : -comp;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const canPaginate = sortedData.length >= itemsPerPage;

  const paginatedData = useMemo(() => {
    if (!showPagination || !canPaginate) return sortedData;
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, showPagination, canPaginate]);

  const paginationInfo = useMemo(() => {
    if (!showPagination && !alwaysShowPagination) return null;
    const start = canPaginate ? (currentPage - 1) * itemsPerPage + 1 : 1;
    const end = canPaginate ? Math.min(currentPage * itemsPerPage, sortedData.length) : sortedData.length;
    return { start, end, total: sortedData.length };
  }, [currentPage, sortedData.length, itemsPerPage, showPagination, alwaysShowPagination, canPaginate]);

  // Render cell content
  const renderCellContent = useCallback(
    (column: TableColumn<T>, row: T, index: number) => {
      if (column.render) {
        return column.render(row[column.key], row, index);
      }
      return String(row[column.key] ?? '');
    },
    []
  );

  const SortIcon = useMemo(
    () =>
      ({ active, direction }: { active: boolean; direction?: 'asc' | 'desc' }) => {
        if (!active) {
          return (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
            </svg>
          );
        }
  
        return direction === 'asc' ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      },
    []
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                  }`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        <SortIcon active={sortConfig?.key === column.key} direction={sortConfig?.direction} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${hoverable ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderCellContent(column, row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION UI */}
      {(showPagination || alwaysShowPagination) && paginationInfo && (
        <div className="p-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <b>{paginationInfo.start}</b> to <b>{paginationInfo.end}</b> of{' '}
            <b>{paginationInfo.total}</b>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              type="button"
              disabled={currentPage === 1 || !canPaginate}
              onClick={() => canPaginate && setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-black"
            >
              Back
            </button>

            {/* Page numbers - only show if can paginate */}
            {canPaginate ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))
            ) : (
              <button
                className="px-3 py-1 rounded bg-indigo-600 text-white cursor-default"
              >
                1
              </button>
            )}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages || !canPaginate}
              onClick={() => canPaginate && setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-black"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}