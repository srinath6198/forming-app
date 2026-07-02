import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FormInput } from "@/components/FormInput";

export default function Settings() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("flora_theme") as "dark" | "light") ?? "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("flora_theme", theme);
  }, [theme]);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your store" />
      <div className="panel settings-panel">
        <div className="settings-panel__row">
          <div>
            <p className="panel__title" style={{ marginBottom: 4 }}>Appearance</p>
            <p className="data-table__muted">Switch between dark and light mode</p>
          </div>
          <button
            type="button"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="btn btn--primary btn--sm"
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
        {[
          ["Store Name", "FloraBill Co."],
          ["GSTIN", "29ABCDE1234F1Z5"],
          ["Currency", "INR (₹)"],
          ["Invoice Prefix", "INV-"],
        ].map(([l, v]) => (
          <FormInput key={l} label={l} defaultValue={v} />
        ))}
        <button type="button" className="btn btn--primary">Save changes</button>
      </div>
    </div>
  );
}
