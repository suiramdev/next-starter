"use client";

import { Table as TanstackTable, RowData } from "@tanstack/react-table";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu";
import { ColumnsIcon } from "@repo/ui/registry/admin/icons/columns";
import { ChevronDownIcon } from "@repo/ui/registry/admin/icons/chevron-down";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/registry/new-york-v4/ui/select";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Button } from "@/registry/new-york-v4/ui/button";
import { ChevronsLeftIcon } from "@repo/ui/registry/admin/icons/chevrons-left";
import { ChevronsRightIcon } from "@repo/ui/registry/admin/icons/chevrons-right";
import { ChevronLeftIcon } from "@repo/ui/registry/admin/icons/chevron-left";
import { ChevronRightIcon } from "@repo/ui/registry/admin/icons/chevron-right";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b bg-muted", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

type TableColumnsVisibilityProps<TData extends RowData> =
  React.ComponentProps<"div"> & {
    table: TanstackTable<TData>;
  };

function TableColumnsVisibility<TData extends RowData>({
  className,
  table,
  ...props
}: TableColumnsVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ColumnsIcon />
          <span className="hidden lg:inline">Columns</span>
          <span className="lg:hidden">Columns</span>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type TableToolbarProps<TData extends RowData> = React.ComponentProps<"div"> & {
  table: TanstackTable<TData>;
};

function TableToolbar<TData extends RowData>({
  className,
  table,
  children,
  ...props
}: TableToolbarProps<TData>) {
  return (
    <div
      className={cn("flex items-center justify-between px-4", className)}
      {...props}
    >
      <div />
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <TableColumnsVisibility table={table} />
        {children}
      </div>
    </div>
  );
}

type TableSelectionSummaryProps<TData extends RowData> =
  React.ComponentProps<"div"> & {
    table: TanstackTable<TData>;
  };

function TableSelectionSummary<TData extends RowData>({
  className,
  table,
  ...props
}: TableSelectionSummaryProps<TData>) {
  return (
    <div
      data-slot="table-selection-summary"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  );
}

type TablePaginationProps<TData extends RowData> =
  React.ComponentProps<"div"> & {
    table: TanstackTable<TData>;
  };

function TablePagination<TData extends RowData>({
  className,
  table,
  ...props
}: TablePaginationProps<TData>) {
  return (
    <div
      className={cn("flex w-full items-center gap-8 lg:w-fit", className)}
      {...props}
    >
      <div className="hidden items-center gap-2 lg:flex">
        <Label htmlFor="rows-per-page" className="text-sm font-medium">
          Rows per page
        </Label>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-20" id="rows-per-page">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-fit items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeftIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 lg:flex"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  );
}

type TableControlsProps<TData extends RowData> = React.ComponentProps<"div"> & {
  table: TanstackTable<TData>;
};

function TableControls<TData extends RowData>({
  className,
  table,
  ...props
}: TableControlsProps<TData>) {
  return (
    <div
      data-slot="table-controls"
      className={cn("flex items-center justify-between px-4", className)}
      {...props}
    >
      <TableSelectionSummary table={table} />
      <TablePagination table={table} />
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableToolbar,
  TableSelectionSummary,
  TablePagination,
  TableControls,
};
