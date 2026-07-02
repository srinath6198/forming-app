import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addSupplier, deleteSupplier, updateSupplier } from "@/redux/supplierSlice";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Supplier } from "@/types";

const blank: Supplier = { id: "", name: "", company: "", mobile: "", email: "", address: "" };

export default function Suppliers() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.suppliers.items);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<Supplier | null>(null);
  const filtered = items.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  function save() {
    if (!modal) return;
    if (modal.id) dispatch(updateSupplier(modal));
    else dispatch(addSupplier({ ...modal, id: crypto.randomUUID() }));
    setModal(null);
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle={`${items.length} suppliers`}
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
          { key: "company", label: "Company" },
          { key: "mobile", label: "Mobile" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
        ]}
        data={filtered}
        actions={(row) => (
          <div className="data-table__actions">
            <button type="button" onClick={() => setModal(row)} className="btn btn--ghost"><FiEdit2 /></button>
            <button type="button" onClick={() => dispatch(deleteSupplier(row.id))} className="btn btn--danger"><FiTrash2 /></button>
          </div>
        )}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? "Edit Supplier" : "Add Supplier"}>
        {modal && (
          <div className="form-grid">
            <FormInput label="Name" value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} />
            <FormInput label="Company" value={modal.company} onChange={(e) => setModal({ ...modal, company: e.target.value })} />
            <FormInput label="Mobile" value={modal.mobile} onChange={(e) => setModal({ ...modal, mobile: e.target.value })} />
            <FormInput label="Email" value={modal.email} onChange={(e) => setModal({ ...modal, email: e.target.value })} />
            <FormInput label="Address" fullWidth value={modal.address} onChange={(e) => setModal({ ...modal, address: e.target.value })} />
            <button type="button" onClick={save} className="btn btn--primary btn--block form-grid--full">Save</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
