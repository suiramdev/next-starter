import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { ChevronDownIcon } from "@repo/ui/registry/admin/icons/chevron-down";
import { Loader2Icon } from "@repo/ui/registry/admin/icons/loader2";
import { cn } from "@repo/ui/lib/utils";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/registry/new-york-v4/ui/select";
import { ChevronsLeftIcon } from "@repo/ui/registry/admin/icons/chevrons-left";
import { ChevronLeftIcon } from "@repo/ui/registry/admin/icons/chevron-left";
import { ChevronRightIcon } from "@repo/ui/registry/admin/icons/chevron-right";
import { ChevronsRightIcon } from "@repo/ui/registry/admin/icons/chevrons-right";
import { ColumnsIcon } from "@repo/ui/registry/admin/icons/columns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import {
  flexRender,
  RowData,
  Table as TanstackTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type ControlledTableColumnsVisibilityProps<TData extends RowData> = React.ComponentProps<
  typeof DropdownMenu
> & {
  table: TanstackTable<TData>;
};

function ControlledTableColumnsVisibility<TData extends RowData>({
  table,
  ...props
}: ControlledTableColumnsVisibilityProps<TData>) {
  return (
    <DropdownMenu {...props}>
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
                {column.columnDef.header?.toString() || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ControlledTableToolbarProps<TData extends RowData> = React.ComponentProps<"div"> & {
  table: TanstackTable<TData>;
};

function ControlledTableToolbar<TData extends RowData>({
  className,
  table,
  children,
  ...props
}: ControlledTableToolbarProps<TData>) {
  return (
    <div
      className={cn("flex items-center justify-between px-4", className)}
      {...props}
    >
      <div />
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <ControlledTableColumnsVisibility table={table} />
        {children}
      </div>
    </div>
  );
}

type ControlledTableSelectionSummaryProps<TData extends RowData> =
  React.ComponentProps<"div"> & {
    table: TanstackTable<TData>;
  };

function ControlledTableSelectionSummary<TData extends RowData>({
  className,
  table,
  ...props
}: ControlledTableSelectionSummaryProps<TData>) {
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

type ControlledTablePaginationProps<TData extends RowData> =
  React.ComponentProps<"div"> & {
    table: TanstackTable<TData>;
  };

function ControlledTablePagination<TData extends RowData>({
  className,
  table,
  ...props
}: ControlledTablePaginationProps<TData>) {
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

type ControlledTableControlsProps<TData extends RowData> = React.ComponentProps<"div"> & {
  table: TanstackTable<TData>;
};

function ControlledTableControls<TData extends RowData>({
  className,
  table,
  ...props
}: ControlledTableControlsProps<TData>) {
  return (
    <div
      data-slot="table-controls"
      className={cn("flex items-center justify-between px-4", className)}
      {...props}
    >
      <ControlledTableSelectionSummary table={table} />
      <ControlledTablePagination table={table} />
    </div>
  );
}

type ControlledTableContentProps<TData extends RowData> = {
  table: TanstackTable<TData>;
  isLoading?: boolean;
}

function ControlledTableContent<TData extends RowData>({ isLoading, table }: ControlledTableContentProps<TData>) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={table.getAllColumns().length} className="text-center py-8">
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-4 animate-spin" />
          </div>
        </TableCell>
      </TableRow>
    );
  }
  
  if (table.getRowCount() <= 0) {
    return (
      <TableRow>
        <TableCell colSpan={table.getAllColumns().length} className="text-center py-8">
          No results.
        </TableCell>
      </TableRow>
    );
  }

  return table.getRowModel().rows.map((row) => (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={
            typeof cell.column.columnDef.meta?.className === "string"
              ? cell.column.columnDef.meta.className
              : undefined
          }
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

type ControlledTableProps<TData extends RowData> = {
  table: TanstackTable<TData>;
  toolbar?: React.ReactNode;
  hideToolbar?: boolean;
  hideControls?: boolean;
  loading?: boolean;
};

function ControlledTable<TData extends RowData>({
  table,
  toolbar,
  hideToolbar = false,
  hideControls = false,
  loading = false,
}: ControlledTableProps<TData>) {
  return (
    <div className="flex flex-col gap-4">
      {!hideToolbar && (
        <ControlledTableToolbar table={table}>
          {toolbar}
        </ControlledTableToolbar>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={
                    typeof header.column.columnDef.meta?.className === "string"
                      ? header.column.columnDef.meta.className
                      : undefined
                  }
                >
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
          <ControlledTableContent table={table} isLoading={loading} />
        </TableBody>
      </Table>
      {!hideControls && <ControlledTableControls table={table} />}
    </div>
  );
}

export {
    ControlledTableColumnsVisibility,
    ControlledTableToolbar,
    ControlledTableControls,
    ControlledTable
};