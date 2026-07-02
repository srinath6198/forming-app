import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { deleteProduct } from "@/redux/productSlice";
import { FiPlus } from "react-icons/fi";
import ProductTable from "./ProductTable";

export default function Products() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.products.items);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${items.length} items in inventory`}
        actions={
          <Link to="/products/add" className="btn btn--primary btn--sm">
            <FiPlus /> Add Product
          </Link>
        }
      />
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={q} onChange={setQ} placeholder="Search products..." />
      </div>
      <ProductTable
        data={paged}
        page={page}
        pages={pages}
        setPage={setPage}
        onDelete={(id) => dispatch(deleteProduct(id))}
      />
    </div>
  );
}
