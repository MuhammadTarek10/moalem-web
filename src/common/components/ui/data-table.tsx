"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Optional toolbar content (filters, buttons) rendered before search. */
  toolbar?: React.ReactNode;
  /** Filter placeholder. If provided, shows search input. */
  filterPlaceholder?: string;
  /** Column ID to filter on when using client-side filtering. */
  filterColumn?: string;
  /** Server-side search: controlled value and onChange. When set, disables client-side filtering. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Optional pagination. When provided, uses server-side pagination instead of client-side. */
  serverPagination?: {
    page: number;
    pageCount: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  filterPlaceholder,
  filterColumn = "code",
  searchValue,
  onSearchChange,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const isServerSearch = searchValue !== undefined && onSearchChange !== undefined;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    ...(serverPagination
      ? {}
      : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    ...(isServerSearch ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    state: {
      sorting,
      columnFilters: isServerSearch ? [] : columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {(toolbar || filterPlaceholder) && (
        <div className="flex flex-wrap items-center gap-4 py-2">
          {toolbar}
          {filterPlaceholder && (
          <Input
            placeholder={filterPlaceholder}
            value={
              isServerSearch
                ? searchValue ?? ""
                : ((table.getColumn(filterColumn)?.getFilterValue() as string) ?? "")
            }
            onChange={(event) => {
              const value = event.target.value;
              if (isServerSearch) {
                onSearchChange(value);
              } else {
                table.getColumn(filterColumn)?.setFilterValue(value);
              }
            }}
            className="max-w-sm"
          />
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {serverPagination ? (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredRowModel().rows.length} of{" "}
            {serverPagination.total} row(s)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                serverPagination.onPageChange(serverPagination.page - 1)
              }
              disabled={serverPagination.page <= 1}
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {serverPagination.page} of {serverPagination.pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                serverPagination.onPageChange(serverPagination.page + 1)
              }
              disabled={
                serverPagination.page >= serverPagination.pageCount
              }
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
