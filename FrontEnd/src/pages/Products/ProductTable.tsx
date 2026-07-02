import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { deleteProduct } from "@/redux/productSlice";

import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

import type { Product } from "@/types";

const PAGE_SIZE = 8;

export default function ProductTable() {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.products.items);

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return items.filter((product) =>
      [
        product.name,
        product.category,
        product.subCategory,
        product.variant,
        product.color,
        product.supplierName,
        product.skuCode,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [items, query]);

  const pages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function handleSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (confirmDelete) {
      dispatch(deleteProduct(id));
    }
  }

  return (
    <div className="products-list">
      <PageHeader
        title="Products"
        subtitle={`${items.length} items in inventory`}
        actions={
          <Link
            to="/products/add"
            className="btn btn--primary btn--sm"
          >
            <FiPlus />
            Add Product
          </Link>
        }
      />

      <div className="products-list__search">
        <SearchBar
          value={query}
          onChange={handleSearch}
          placeholder="Search flower products..."
        />
      </div>

      <DataTable
        columns={[
          {
            key: "product",
            label: "Product",
            render: (row: Product) => (
              <div className="data-table__cell-stack">
                <img
                  src={
                    row.image ||
                    "https://via.placeholder.com/60"
                  }
                  alt={row.name}
                  className="data-table__thumb"
                />

                <div>
                  <strong>{row.name}</strong>

                  <div className="text-muted">
                    {row.productId}
                  </div>
                </div>
              </div>
            ),
          },

          {
            key: "category",
            label: "Category",
            render: (row: Product) => (
              <div>
                <div>{row.category}</div>
                <small>{row.subCategory}</small>
              </div>
            ),
          },

          {
            key: "variant",
            label: "Variant",
            render: (row: Product) => (
              <div>
                <div>{row.variant}</div>
                <small>{row.color}</small>
              </div>
            ),
          },

          {
            key: "supplierName",
            label: "Supplier",
            render: (row: Product) => row.supplierName,
          },

          {
            key: "purchasePrice",
            label: "Purchase",
            render: (row: Product) =>
              `₹${row.purchasePrice}`,
          },

          {
            key: "sellingPrice",
            label: "Selling",
            render: (row: Product) =>
              `₹${row.sellingPrice}`,
          },

          {
            key: "stock",
            label: "Stock",
            render: (row: Product) => (
              <span
                className={`badge ${
                  row.stock <= row.minimumStockAlert
                    ? "badge--danger"
                    : "badge--success"
                }`}
              >
                {row.stock}

                {row.stock <= row.minimumStockAlert
                  ? " · Low"
                  : ""}
              </span>
            ),
          },

          {
            key: "unit",
            label: "Unit",
            render: (row: Product) => row.unit,
          },

          {
            key: "expiryDate",
            label: "Expiry Date",
            render: (row: Product) =>
              row.expiryDate || "-",
          },

          {
            key: "status",
            label: "Status",
            render: (row: Product) => (
              <span
                className={`badge ${
                  row.status
                    ? "badge--success"
                    : "badge--danger"
                }`}
              >
                {row.status ? "Active" : "Inactive"}
              </span>
            ),
          },
        ]}
        data={paged}
        actions={(row: Product) => (
          <div className="data-table__actions">
            <Link
              to={`/products/edit/${row.id}`}
              className="btn btn--ghost"
              title="Edit"
            >
              <FiEdit2 />
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="btn btn--danger"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      />

      {pages > 1 && (
        <div className="pagination">
          {Array.from(
            { length: pages },
            (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index + 1)}
                className={`pagination__btn ${
                  page === index + 1
                    ? "pagination__btn--active"
                    : ""
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}