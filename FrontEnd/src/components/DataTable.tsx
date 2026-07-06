import type { ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  actions,
  loading,
}: {
  columns: Column<T>[];
  data: T[];
  actions?: (row: T) => ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="data-table">
      <div className="data-table__wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)}>{c.label}</th>
              ))}
              {actions && <th style={{ textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="data-table__empty">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="data-table__empty">
                  No records
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={String(c.key)}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                    </td>
                  ))}
                  {actions && <td style={{ textAlign: "right" }}>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
