import { PageHeader } from "@/components/PageHeader";
import { useAppSelector } from "@/app/hooks";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import jsPDF from "jspdf";
import { FiDownload, FiPrinter } from "react-icons/fi";

export default function Reports() {
  const products = useAppSelector((s) => s.products.items);
  const bills = useAppSelector((s) => s.billing.bills);

  const monthly = [
    { m: "Jan", sales: 12000 }, { m: "Feb", sales: 14500 }, { m: "Mar", sales: 11000 },
    { m: "Apr", sales: 17800 }, { m: "May", sales: 21000 }, { m: "Jun", sales: 19500 },
  ];

  const stock = products.map((p) => ({ name: p.name.split(" ")[0], stock: p.stock }));
  const revenue = bills.reduce((a, b) => a + b.grandTotal, 0);
  const cost = products.reduce((a, p) => a + p.buyingPrice * 5, 0);

  function exportPDF() {
    const doc = new jsPDF();
    doc.text("FloraBill — Sales Report", 14, 18);
    monthly.forEach((m, i) => doc.text(`${m.m}: ₹${m.sales}`, 14, 30 + i * 8));
    doc.save("report.pdf");
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Daily, monthly & stock analytics"
        actions={
          <div className="page-header__actions">
            <button type="button" onClick={() => window.print()} className="btn btn--secondary btn--sm no-print">
              <FiPrinter /> Print
            </button>
            <button type="button" onClick={exportPDF} className="btn btn--primary btn--sm">
              <FiDownload /> PDF
            </button>
          </div>
        }
      />
      <div className="reports-grid">
        <div className="panel">
          <h3 className="panel__title">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="m" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Line dataKey="sales" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3 className="panel__title">Stock Report</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stock}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="stock" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel reports-grid__wide">
          <h3 className="panel__title">Profit / Loss Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <p className="summary-item__label">Total Revenue</p>
              <p className="summary-item__value">₹{revenue.toLocaleString()}</p>
            </div>
            <div className="summary-item">
              <p className="summary-item__label">Cost</p>
              <p className="summary-item__value">₹{cost.toLocaleString()}</p>
            </div>
            <div className="summary-item">
              <p className="summary-item__label">Profit</p>
              <p className="summary-item__value summary-item__value--primary">₹{(revenue - cost).toLocaleString()}</p>
            </div>
            <div className="summary-item">
              <p className="summary-item__label">Orders</p>
              <p className="summary-item__value">{bills.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
