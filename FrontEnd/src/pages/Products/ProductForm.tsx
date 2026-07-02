import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { PageHeader } from "@/components/PageHeader";
import { FormInput } from "@/components/FormInput";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addProduct, updateProduct } from "@/redux/productSlice";

import type { Product } from "@/types";

import "./ProductForm.scss";

const blankProduct: Product = {

  name: "",
  category: "",
  subCategory: "",
  variant: "",

  color: "",
  length: "",
  size: "",

  stemCount: 0,
  bundleType: "",
  quantity: 1,
  unit: "Bunch",

  purchasePrice: 0,
  sellingPrice: 0,
  discount: 0,

  stock: 0,
  minimumStockAlert: 0,

  supplierName: "",

  barcode: "",
  skuCode: "",

  expiryDate: "",

  freshness: "",
  storageType: "",
  fragranceType: "",
  occasion: "",

  countryOrigin: "",

  image: "",
  description: "",

  status: true,

  createdDate: "",
  updatedDate: "",
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.products.items);

  const existing = isEdit
    ? items.find((product) => product.id === id)
    : undefined;

  const [form, setForm] = useState<Product>(blankProduct);

  useEffect(() => {
    if (isEdit && existing) {
      setForm(existing);
    } else {
      setForm(blankProduct);
    }
  }, [isEdit, existing]);

  function updateField<K extends keyof Product>(
    key: K,
    value: Product[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) return;

    const payload: Product = {
      ...form,
      updatedDate: new Date().toISOString(),
    };

    if (isEdit) {
      dispatch(updateProduct(payload));
    } else {
      dispatch(
        addProduct({
          ...payload,
          id: crypto.randomUUID(),
          productId: `ROS-${Date.now()}`,
          createdDate: new Date().toISOString(),
        })
      );
    }

    navigate("/products");
  }

  if (isEdit && id && !existing) {
    return (
      <div className="product-form-page">
        <PageHeader
          title="Product Not Found"
          subtitle="This product may have been removed."
        />

        <Link to="/products" className="btn btn--secondary btn--sm">
          <FiArrowLeft />
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <PageHeader
        title={isEdit ? "Edit Product" : "Add Product"}
        subtitle={
          isEdit
            ? form.name || "Update product details"
            : "Create a new flower inventory product"
        }
        actions={
          <Link to="/products" className="btn btn--secondary btn--sm">
            <FiArrowLeft />
            Back to List
          </Link>
        }
      />

      <div className="panel product-form-page__panel">
        <form className="form-grid product-form" onSubmit={handleSubmit}>
          <FormInput
            label="Product Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />

          <FormInput
            label="Category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          />

          <FormInput
            label="Sub Category"
            value={form.subCategory}
            onChange={(e) => updateField("subCategory", e.target.value)}
          />

          <FormInput
            label="Variant"
            value={form.variant}
            onChange={(e) => updateField("variant", e.target.value)}
          />

          <FormInput
            label="Color"
            value={form.color}
            onChange={(e) => updateField("color", e.target.value)}
          />

          <FormInput
            label="Length"
            value={form.length}
            onChange={(e) => updateField("length", e.target.value)}
          />

          <FormInput
            label="Size"
            value={form.size}
            onChange={(e) => updateField("size", e.target.value)}
          />

          <FormInput
            label="Stem Count"
            type="number"
            min={0}
            value={form.stemCount}
            onChange={(e) =>
              updateField("stemCount", Number(e.target.value))
            }
          />

          <FormInput
            label="Bundle Type"
            value={form.bundleType}
            onChange={(e) => updateField("bundleType", e.target.value)}
          />

          <FormInput
            label="Quantity"
            type="number"
            min={0}
            value={form.quantity}
            onChange={(e) =>
              updateField("quantity", Number(e.target.value))
            }
          />

          <FormInput
            label="Unit"
            value={form.unit}
            onChange={(e) => updateField("unit", e.target.value)}
          />

          <FormInput
            label="Purchase Price (₹)"
            type="number"
            min={0}
            value={form.purchasePrice}
            onChange={(e) =>
              updateField("purchasePrice", Number(e.target.value))
            }
          />

          <FormInput
            label="Selling Price (₹)"
            type="number"
            min={0}
            value={form.sellingPrice}
            onChange={(e) =>
              updateField("sellingPrice", Number(e.target.value))
            }
          />

          <FormInput
            label="Discount (%)"
            type="number"
            min={0}
            value={form.discount}
            onChange={(e) =>
              updateField("discount", Number(e.target.value))
            }
          />

          <FormInput
            label="Stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) =>
              updateField("stock", Number(e.target.value))
            }
          />

          <FormInput
            label="Minimum Stock Alert"
            type="number"
            min={0}
            value={form.minimumStockAlert}
            onChange={(e) =>
              updateField(
                "minimumStockAlert",
                Number(e.target.value)
              )
            }
          />

          <FormInput
            label="Supplier Name"
            value={form.supplierName}
            onChange={(e) =>
              updateField("supplierName", e.target.value)
            }
          />

          <FormInput
            label="Barcode"
            value={form.barcode}
            onChange={(e) => updateField("barcode", e.target.value)}
          />

          <FormInput
            label="SKU Code"
            value={form.skuCode}
            onChange={(e) => updateField("skuCode", e.target.value)}
          />

          <FormInput
            label="Expiry Date"
            type="date"
            value={form.expiryDate}
            onChange={(e) =>
              updateField("expiryDate", e.target.value)
            }
          />

          <FormInput
            label="Freshness"
            value={form.freshness}
            onChange={(e) => updateField("freshness", e.target.value)}
          />

          <FormInput
            label="Storage Type"
            value={form.storageType}
            onChange={(e) =>
              updateField("storageType", e.target.value)
            }
          />

          <FormInput
            label="Fragrance Type"
            value={form.fragranceType}
            onChange={(e) =>
              updateField("fragranceType", e.target.value)
            }
          />

          <FormInput
            label="Occasion"
            value={form.occasion}
            onChange={(e) => updateField("occasion", e.target.value)}
          />

          <FormInput
            label="Country Origin"
            value={form.countryOrigin}
            onChange={(e) =>
              updateField("countryOrigin", e.target.value)
            }
          />

          <FormInput
            label="Image URL"
            value={form.image}
            onChange={(e) => updateField("image", e.target.value)}
          />

          <div className="form-grid--full">
            <label className="form-label">Description</label>

            <textarea
              className="form-textarea"
              rows={5}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
            />
          </div>

          <div className="form-grid--full">
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) =>
                  updateField("status", e.target.checked)
                }
              />
              Active Status
            </label>
          </div>

          {form.image && (
            <div className="form-grid--full product-form__preview">
              <img src={form.image} alt="Preview" />
            </div>
          )}

          <div className="form-grid--full product-form__actions">
            <button type="submit" className="btn btn--primary">
              {isEdit ? "Update Product" : "Add Product"}
            </button>

            <Link
              to="/products"
              className="btn btn--secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}