import { useDarkMode } from "@shared/hooks/useDarkMode";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  HeaderGroup,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsLeft,
  ChevronsRight,
  FileX,
} from "lucide-react";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import * as XLSX from "xlsx";

type Action<T> = {
  label?: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string | ((row: T) => string | undefined);
  show?: (row: T) => boolean;
};

type HeaderAction = {
  label?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  actions?: Action<T>[];
  actionsHeader?: string;
  headerAction?: HeaderAction;
  exportFileName?: string;
  enableExport?: boolean;
  enableSearch?: boolean;
  rowBorderColor?: (row: T) => string | undefined;
};

export function DataTable<T>({
  data,
  columns,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  actions,
  actionsHeader = "Acciones",
  headerAction,
  exportFileName = "datos",
  enableExport = false,
  enableSearch = true,
  rowBorderColor,
}: DataTableProps<T>) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramPage = Number(searchParams.get("page") ?? "1");
  const paramPageSize = Number(
    searchParams.get("pageSize") ?? `${defaultPageSize}`
  );
  const paramSortBy = searchParams.get("sortBy") ?? "";
  const paramSortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") ?? "asc";
  const paramFilter = searchParams.get("filter") ?? "";

  const [globalFilter, setGlobalFilter] = useState(paramFilter);
  const [sorting, setSorting] = useState<SortingState>(
    paramSortBy ? [{ id: paramSortBy, desc: paramSortOrder === "desc" }] : []
  );
  const [pageIndex, setPageIndex] = useState(paramPage - 1);
  const [pageSize, setPageSize] = useState(paramPageSize);

  const { darkMode, isMounted } = useDarkMode();
  const mountedAndDark = isMounted && darkMode;
  const headerBg = mountedAndDark ? "#1f2b4a" : "#273459";
  const paginationBg = headerBg;

  // Export to Excel
  const handleExport = () => {
    const colsWithAccessor = columns.filter((c: any) => c.accessorKey);
    const headers = colsWithAccessor.map((col: any) =>
      typeof col.header === "string" ? col.header : col.accessorKey
    );
    const dataToExport = data.map((row: any) => {
      const exportRow: any = {};
      colsWithAccessor.forEach((col: any) => {
        const key = col.accessorKey;
        const header = typeof col.header === "string" ? col.header : key;
        exportRow[header] = row[key];
      });
      return exportRow;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport, {
      header: headers,
      skipHeader: false,
    });
    const lastCol = XLSX.utils.encode_col(headers.length - 1);
    const lastRow = dataToExport.length + 1;
    worksheet["!autofilter"] = { ref: `A1:${lastCol}${lastRow}` };
    const colsWidths = headers.map((h) => {
      let maxLen = String(h).length;
      for (let r = 0; r < dataToExport.length; r++) {
        const val = dataToExport[r][h];
        const len = val == null ? 0 : String(val).length;
        if (len > maxLen) maxLen = len;
      }
      return { wch: Math.min(Math.max(8, maxLen + 2), 60) };
    });
    worksheet["!cols"] = colsWidths;
    worksheet["!ref"] = `A1:${lastCol}${lastRow}`;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };

  // Añadir columna de acciones (si aplica)
  const columnsWithActions: ColumnDef<T, any>[] = useMemo(() => {
    if (!actions) return columns;
    return [
      ...columns,
      {
        id: "actions",
        header: actionsHeader,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {actions.map((action, idx) => {
              const shouldShow = action.show ? action.show(row.original) : true;
              if (!shouldShow) return null;

              const defaultBtn =
                "px-2 py-1 border-2 border-[#273459] text-[#273459] rounded-md hover:bg-[#273459] hover:text-white transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap";
              const darkOverrides =
                "dark:border-gray-300 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white";
              const resolvedClassName =
                typeof action.className === "function"
                  ? (action.className as (row: T) => string | undefined)(
                      row.original
                    )
                  : action.className;

              const btnClass = resolvedClassName
                ? `${resolvedClassName} ${darkOverrides}`
                : `${defaultBtn} ${darkOverrides}`;

              return (
                <button
                  key={idx}
                  onClick={() => action.onClick(row.original)}
                  className={btnClass}
                  title={action.label}
                  aria-label={String(action.label ?? "")}
                >
                  <span className="flex-shrink-0">{action.icon}</span>
                  {/* Mostrar siempre la etiqueta; ajustar tamaño para pantallas pequeñas */}
                  {action.label && (
                    <span className="text-xs sm:text-sm">{action.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        ),
      },
    ];
  }, [actions, columns, actionsHeader]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      sorting,
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Helper: buscar Header real por column id (para pasar HeaderContext correcto a flexRender)
  const getHeaderByColumnId = (colId: string): Header<any, any> | undefined => {
    for (const hg of table.getHeaderGroups()) {
      const found = hg.headers.find((h) => h.id === colId);
      if (found) return found as Header<any, any>;
    }
    return undefined;
  };

  useEffect(() => {
    const sort = sorting[0];
    const sortBy = sort ? sort.id : "";
    const sortOrder = sort ? (sort.desc ? "desc" : "asc") : "asc";
    const fp = globalFilter;
    const pg = pageIndex + 1;
    const ps = pageSize;

    const params = new URLSearchParams();
    if (fp) params.set("filter", fp);
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    params.set("page", pg.toString());
    params.set("pageSize", ps.toString());

    navigate({ search: params.toString() });
  }, [globalFilter, sorting, pageIndex, pageSize, navigate]);

  const hasData = table.getRowModel().rows.length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-400 dark:border-slate-700 rounded-2xl p-3 md:p-4">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {enableSearch && (
          <input
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            type="search"
            placeholder="Filtrar..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPageIndex(0);
            }}
            className="w-full sm:max-w-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 placeholder-gray-400 text-sm
            border-gray-300 text-gray-700 focus:ring-[#273459] dark:focus:ring-[#1f2b4a]
            dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200"
          />
        )}

        <div className="flex gap-2 flex-shrink-0">
          {enableExport && (
            <button
              onClick={handleExport}
              className="px-2 py-2 text-green-600 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              title="Exportar a Excel"
            >
              <FileX size={20} />
            </button>
          )}

          {headerAction && (
            <button
              onClick={headerAction.onClick}
              className={
                headerAction.className ||
                "px-3 py-2 bg-[#273459] text-white rounded-lg hover:bg-[#1f2b4a] transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              }
              style={{ backgroundColor: headerBg }}
              title={headerAction.label}
            >
              {headerAction.icon}
              {headerAction.label && (
                <span className="hidden sm:inline">{headerAction.label}</span>
              )}
            </button>
          )}
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FileX size={48} className="text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            No hay datos para mostrar
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-0">
              <thead>
                {table.getHeaderGroups().map((hg: HeaderGroup<any>) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header, idx) => {
                      const isSorted = header.column.getIsSorted();
                      const first = idx === 0;
                      const last = idx === hg.headers.length - 1;
                      const isActionsColumn = header.id === "actions";
                      const thClasses = [
                        "px-3 xl:px-6 py-3 text-xs xl:text-sm font-semibold text-white uppercase tracking-wide select-none",
                        !isActionsColumn && "cursor-pointer",
                        first && "rounded-tl-lg",
                        last && "rounded-tr-lg",
                        isActionsColumn && "text-right",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <th
                          key={header.id}
                          onClick={
                            !isActionsColumn
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          className={thClasses}
                          style={{ backgroundColor: headerBg }}
                        >
                          <div
                            className={`flex items-center space-x-1 ${isActionsColumn ? "justify-end" : ""}`}
                          >
                            <span className="break-words">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {!isActionsColumn && isSorted === "asc" && (
                              <ArrowUp size={14} color="white" />
                            )}
                            {!isActionsColumn && isSorted === "desc" && (
                              <ArrowDown size={14} color="white" />
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody className="bg-gray-50 dark:bg-gray-800">
                {table.getRowModel().rows.map((row, rowIndex) => {
                  const isLastRow =
                    rowIndex === table.getRowModel().rows.length - 1;
                  const borderColor = rowBorderColor
                    ? rowBorderColor(row.original)
                    : undefined;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {row.getVisibleCells().map((cell, cellIdx) => {
                        const firstCell = cellIdx === 0;
                        const lastCell =
                          cellIdx === row.getVisibleCells().length - 1;
                        const isActionsColumn = cell.column.id === "actions";
                        const cellBorderStyle: CSSProperties =
                          firstCell && borderColor
                            ? { borderLeft: `4px solid ${borderColor}` }
                            : {};

                        const tdClasses = [
                          "px-3 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm text-gray-800 dark:text-gray-200 break-words align-top border-b border-gray-200 dark:border-gray-700",
                          !isActionsColumn && "max-w-[150px] xl:max-w-xs",
                          isLastRow && firstCell && "rounded-bl-lg",
                          isLastRow && lastCell && "rounded-br-lg",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <td
                            key={cell.id}
                            className={tdClasses}
                            style={cellBorderStyle}
                          >
                            <div className="overflow-hidden break-words">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tablet: compacto (visible md..lg) */}
          <div className="hidden md:block lg:hidden space-y-3">
            {table.getRowModel().rows.map((row) => {
              const borderColor = rowBorderColor
                ? rowBorderColor(row.original)
                : undefined;
              const borderStyle: CSSProperties = borderColor
                ? { borderLeft: `4px solid ${borderColor}` }
                : {};
              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-all duration-150"
                  style={borderStyle}
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {row.getVisibleCells().map((cell) => {
                      const headerObj = getHeaderByColumnId(cell.column.id);
                      const headerContent = headerObj
                        ? flexRender(
                            headerObj.column.columnDef.header,
                            headerObj.getContext()
                          )
                        : typeof cell.column.columnDef.header === "string"
                          ? cell.column.columnDef.header
                          : null;

                      const isActionsColumn = cell.column.id === "actions";
                      if (isActionsColumn) {
                        return (
                          <div
                            key={cell.id}
                            className="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-700 mt-1"
                          >
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-2">
                              {headerContent}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={cell.id} className="flex flex-col">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
                            {headerContent}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-200 break-words">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: lista vertical */}
          <div className="md:hidden space-y-3">
            {table.getRowModel().rows.map((row) => {
              const borderColor = rowBorderColor
                ? rowBorderColor(row.original)
                : undefined;
              const borderStyle: CSSProperties = borderColor
                ? { borderLeft: `4px solid ${borderColor}` }
                : {};
              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-150"
                  style={borderStyle}
                >
                  <div className="space-y-2">
                    {row.getVisibleCells().map((cell) => {
                      const headerObj = getHeaderByColumnId(cell.column.id);
                      const headerContent = headerObj
                        ? flexRender(
                            headerObj.column.columnDef.header,
                            headerObj.getContext()
                          )
                        : typeof cell.column.columnDef.header === "string"
                          ? cell.column.columnDef.header
                          : null;

                      const isActionsColumn = cell.column.id === "actions";
                      if (isActionsColumn) {
                        return (
                          <div
                            key={cell.id}
                            className="pt-3 border-t border-gray-200 dark:border-gray-700"
                          >
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">
                              {headerContent}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={cell.id}
                          className="flex justify-between items-start gap-3 pb-2 border-b border-gray-50 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide min-w-[90px] flex-shrink-0">
                            {headerContent}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-200 text-right break-words flex-1">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 order-2 sm:order-1">
          Página {pageIndex + 1} de {table.getPageCount()}
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 text-white rounded-lg disabled:opacity-50 transition-colors"
            aria-label="Página anterior"
            style={{ backgroundColor: paginationBg }}
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 text-white rounded-lg disabled:opacity-50 transition-colors"
            aria-label="Página siguiente"
            style={{ backgroundColor: paginationBg }}
          >
            <ChevronsRight size={18} />
          </button>
        </div>

        <div className="order-3">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="border rounded-lg px-2 sm:px-3 py-1 focus:outline-none focus:ring-2 text-xs sm:text-sm border-gray-300 focus:ring-[#273459] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-[#1f2b4a]"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt} className="text-gray-900 bg-white">
                Mostrar {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}