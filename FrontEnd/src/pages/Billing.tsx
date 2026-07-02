import { PageHeader } from "@/components/PageHeader";
import { FormInput } from "@/components/FormInput";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart, removeItem, saveBill, setCustomer, setDiscount, setPayment, updateQty } from "@/redux/billingSlice";
import { FiTrash2, FiPrinter, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import Card from "./Card/Card";

export default function Billing() {
  const dispatch = useAppDispatch();
  const { cart, customer, payment, globalDiscount } = useAppSelector((s) => s.billing);

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const gstTotal = cart.reduce((a, i) => a + (i.price * i.quantity * i.gst) / 100, 0);
  const discountTotal = (subtotal * globalDiscount) / 100;
  const grandTotal = +(subtotal + gstTotal - discountTotal).toFixed(2);

  function checkout() {
    if (!cart.length) return;
    dispatch(saveBill({
      id: crypto.randomUUID(),
      invoiceNo: "INV-" + Math.floor(Math.random() * 9000 + 1000),
      date: new Date().toISOString().slice(0, 10),
      customer: customer || "Walk-in",
      items: cart,
      subtotal, gstTotal, discountTotal, grandTotal, payment,
    }));
    dispatch(clearCart());
  }

  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("FloraBill Invoice", 14, 18);
    doc.setFontSize(11);
    doc.text(`Customer: ${customer || "Walk-in"}`, 14, 30);
    doc.text(`Payment: ${payment}`, 14, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);
    let y = 56;
    doc.text("Item", 14, y); doc.text("Qty", 100, y); doc.text("Price", 130, y); doc.text("Total", 170, y);
    y += 4; doc.line(14, y, 196, y); y += 8;
    cart.forEach((i) => {
      doc.text(i.name, 14, y); doc.text(String(i.quantity), 100, y);
      doc.text(`₹${i.price}`, 130, y); doc.text(`₹${i.total}`, 170, y); y += 8;
    });
    y += 4; doc.line(14, y, 196, y); y += 8;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 130, y); y += 6;
    doc.text(`GST: ₹${gstTotal.toFixed(2)}`, 130, y); y += 6;
    doc.text(`Discount: ₹${discountTotal.toFixed(2)}`, 130, y); y += 6;
    doc.setFontSize(13); doc.text(`Grand Total: ₹${grandTotal}`, 130, y);
    doc.save("invoice.pdf");
  }

  return (
    <div>
      <PageHeader title="POS Billing" subtitle="Search, add and bill products" />
      <div className="billing-page">
        <Card />
        <div className="panel billing-page__cart">
          <h3 className="panel__title">Cart</h3>
          <FormInput
            placeholder="Customer name"
            value={customer}
            onChange={(e) => dispatch(setCustomer(e.target.value))}
          />
          <div className="billing-page__cart-list">
            {cart.length === 0 && <p className="data-table__muted">Cart is empty</p>}
            {cart.map((i) => (
              <div key={i.productId} className="billing-page__cart-item">
                <div className="billing-page__cart-name">
                  <div>{i.name}</div>
                  <div className="data-table__muted">₹{i.price} · GST {i.gst}%</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) => dispatch(updateQty({ id: i.productId, qty: +e.target.value }))}
                  className="form-input form-input--sm"
                  style={{ width: 56 }}
                />
                <span>₹{i.total.toFixed(0)}</span>
                <button type="button" onClick={() => dispatch(removeItem(i.productId))} className="btn btn--danger">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
          <div className="billing-page__totals">
            <div className="billing-page__total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="billing-page__total-row"><span>GST</span><span>₹{gstTotal.toFixed(2)}</span></div>
            <div className="billing-page__total-row">
              <span>Discount %</span>
              <input
                type="number"
                min={0}
                max={100}
                value={globalDiscount}
                onChange={(e) => dispatch(setDiscount(+e.target.value))}
                className="form-input form-input--sm"
                style={{ width: 64, textAlign: "right" }}
              />
            </div>
            <div className="billing-page__total-row billing-page__total-row--grand">
              <span>Total</span><span>₹{grandTotal}</span>
            </div>
          </div>
          <div className="billing-page__payments">
            {(["Cash", "UPI", "Card"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => dispatch(setPayment(m))}
                className={`btn btn--secondary btn--sm ${payment === m ? "btn--active" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="billing-page__actions no-print">
            <button type="button" onClick={() => window.print()} className="btn btn--secondary btn--sm">
              <FiPrinter /> Print
            </button>
            <button type="button" onClick={downloadPDF} className="btn btn--secondary btn--sm">
              <FiDownload /> PDF
            </button>
          </div>
          <button type="button" onClick={checkout} className="btn btn--primary btn--block" style={{ marginTop: 12 }}>
            Save & Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
