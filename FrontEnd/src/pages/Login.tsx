import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/redux/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { FormInput } from "@/components/FormInput";

const schema = yup.object({
  email: yup.string().email().required("Email required"),
  password: yup.string().required("Password required"),
});
type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  useEffect(() => { if (isAuthenticated) nav("/"); }, [isAuthenticated, nav]);

  const onSubmit = async (data: FormData) => {
    await dispatch(login(data));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">F</div>
          <h1 className="login-card__title">FloraBill Admin</h1>
          <p className="login-card__subtitle">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="login-card__form">
          <FormInput
            label="Email"
            icon={<FiMail />}
            placeholder="admin@flora.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormInput
            label="Password"
            type="password"
            icon={<FiLock />}
            placeholder="••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="login-card__footer">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
