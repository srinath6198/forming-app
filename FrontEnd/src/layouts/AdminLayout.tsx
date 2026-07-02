import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="layout__main">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
