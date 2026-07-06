import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createCustomer, deleteCustomer, updateCustomer, getAllCustomers } from "@/redux/customerSlice";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Customer } from "@/types";

const blank: Customer = {
  id: 0,
  customer_name: "",
  email: "",
  phone: "",
  alternate_phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  gst_number: "",
  customer_type: "retail",
  credit_limit: 0,
  opening_balance: 0,
  current_balance: 0,
  notes: "",
  is_active: true,
  created_by: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function Customers() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.customers.items);
  const loading = useAppSelector((s) => s.customers.loading);
  const error = useAppSelector((s) => s.customers.error);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<Customer | null>(null);

  // Load customers on component mount
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const filtered = items.filter((c) => c.customer_name.toLowerCase().includes(q.toLowerCase()));

  async function save() {
    if (!modal) return;
    if (modal.id) {
      await dispatch(updateCustomer({ id: modal.id, data: modal })).unwrap();
    } else {
      await dispatch(createCustomer(modal)).unwrap();
    }
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
      {error && <div className="alert alert--error">{error}</div>}
      <div style={{ marginBottom: 16 }}><SearchBar value={q} onChange={setQ} /></div>
      <DataTable
        columns={[
          { key: "customer_name", label: "Name" },
          { key: "phone", label: "Mobile" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "gst_number", label: "GST" },
        ]}
        data={filtered}
        loading={loading}
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
            <FormInput label="Name" value={modal.customer_name} onChange={(e) => setModal({ ...modal, customer_name: e.target.value })} />
            <FormInput label="Mobile" value={modal.phone} onChange={(e) => setModal({ ...modal, phone: e.target.value })} />
            <FormInput label="Email" value={modal.email || ""} onChange={(e) => setModal({ ...modal, email: e.target.value })} />
            <FormInput label="GST" value={modal.gst_number || ""} onChange={(e) => setModal({ ...modal, gst_number: e.target.value })} />
            <FormInput label="Address" fullWidth value={modal.address || ""} onChange={(e) => setModal({ ...modal, address: e.target.value })} />
            <button type="button" onClick={save} className="btn btn--primary btn--block form-grid--full">Save</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
