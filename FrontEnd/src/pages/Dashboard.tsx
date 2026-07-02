import { DashboardCard } from "@/components/DashboardCard";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { useAppSelector } from "@/app/hooks";
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers } from "react-icons/fi";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";

const salesData = [
  { day: "Mon", sales: 1200 }, { day: "Tue", sales: 1800 },
  { day: "Wed", sales: 1500 }, { day: "Thu", sales: 2400 },
  { day: "Fri", sales: 2100 }, { day: "Sat", sales: 3200 },
  { day: "Sun", sales: 2800 },
];

export default function Dashboard() {
  const products = useAppSelector((s) => s.products.items);
  const customers = useAppSelector((s) => s.customers.items);
  const bills = useAppSelector((s) => s.billing.bills);
  const totalSales = bills.reduce((a, b) => a + b.grandTotal, 0);
  const top = products.slice(0, 5).map((p) => ({ name: p.name.split(" ")[0], sold: Math.floor(Math.random() * 50) + 10 }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back — here's your store at a glance." />
      <div className="stats-grid">
        <DashboardCard title="Total Sales" value={`₹${totalSales.toLocaleString()}`} icon={<FiDollarSign />} trend="+12% this week" />
        <DashboardCard title="Total Orders" value={String(bills.length)} icon={<FiShoppingBag />} trend="+5 today" />
        <DashboardCard title="Total Products" value={String(products.length)} icon={<FiPackage />} />
        <DashboardCard title="Total Customers" value={String(customers.length)} icon={<FiUsers />} />
      </div>
      <div className="chart-grid">
        <div className="panel">
          <h3 className="panel__title">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Area type="monotone" dataKey="sales" stroke="#22c55e" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3 className="panel__title">Top Selling Flowers</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="sold" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h3 className="panel__title">Recent Bills</h3>
      <DataTable
        columns={[
          { key: "invoiceNo", label: "Invoice" },
          { key: "date", label: "Date" },
          { key: "customer", label: "Customer" },
          { key: "payment", label: "Payment" },
          { key: "grandTotal", label: "Total", render: (r) => `₹${r.grandTotal}` },
        ]}
        data={bills}
      />
    </div>
  );
}
