import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "@/app/store";
import AdminLayout from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Billing from "@/pages/Billing";
import ProductTable from "@/pages/Products/ProductTable";
import ProductForm from "@/pages/Products/ProductForm";
import Customers from "@/pages/Customer/Customers";
import Suppliers from "@/pages/Suppliers";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/products" element={<ProductTable />} />
              <Route path="/products/add" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
