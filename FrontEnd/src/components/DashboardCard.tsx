import type { ReactNode } from "react";

export function DashboardCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__row">
        <div>
          <p className="dashboard-card__label">{title}</p>
          <p className="dashboard-card__value">{value}</p>
          {trend && <p className="dashboard-card__trend">{trend}</p>}
        </div>
        <div className="dashboard-card__icon">{icon}</div>
      </div>
    </div>
  );
}
