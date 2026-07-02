import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addCustomer, deleteCustomer, updateCustomer } from "@/redux/customerSlice";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Customer } from "@/types";

const blank: Customer = { id: "", name: "", mobile: "", email: "", address: "", gst: "" };

export default function Customers() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.customers.items);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<Customer | null>(null);
  const filtered = items.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  function save() {
    if (!modal) return;
    if (modal.id) dispatch(updateCustomer(modal));
    else dispatch(addCustomer({ ...modal, id: crypto.randomUUID() }));
    setModal(null);
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${items.length} customers`}
        actions={
          <button type="button" onClick={() => setModal({ ...blank })} className="btn btn--primary btn--sm">
            <FiPlus /> Add
          </button>
        }
      />
      <div style={{ marginBottom: 16 }}><SearchBar value={q} onChange={setQ} /></div>
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "mobile", label: "Mobile" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "gst", label: "GST" },
        ]}
        data={filtered}
        actions={(row) => (
          <div className="data-table__actions">
            <button type="button" onClick={() => setModal(row)} className="btn btn--ghost"><FiEdit2 /></button>
            <button type="button" onClick={() => dispatch(deleteCustomer(row.id))} className="btn btn--danger"><FiTrash2 /></button>
          </div>
        )}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? "Edit Customer" : "Add Customer"}>
        {modal && (
          <div className="form-grid">
            <FormInput label="Name" value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} />
            <FormInput label="Mobile" value={modal.mobile} onChange={(e) => setModal({ ...modal, mobile: e.target.value })} />
            <FormInput label="Email" value={modal.email} onChange={(e) => setModal({ ...modal, email: e.target.value })} />
            <FormInput label="GST" value={modal.gst} onChange={(e) => setModal({ ...modal, gst: e.target.value })} />
            <FormInput label="Address" fullWidth value={modal.address} onChange={(e) => setModal({ ...modal, address: e.target.value })} />
            <button type="button" onClick={save} className="btn btn--primary btn--block form-grid--full">Save</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
