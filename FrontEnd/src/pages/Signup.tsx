import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { signup } from "@/redux/authSlice";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { FormInput } from "@/components/FormInput";

const schema = yup.object({
  name: yup.string().required("Name required"),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password required"),
});
type FormData = yup.InferType<typeof schema>;

export default function Signup() {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  useEffect(() => { if (isAuthenticated) nav("/"); }, [isAuthenticated, nav]);

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...signupData } = data;
    await dispatch(signup(signupData));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">F</div>
          <h1 className="login-card__title">FloraBill Admin</h1>
          <p className="login-card__subtitle">Create your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="login-card__form">
          <FormInput
            label="Full Name"
            icon={<FiUser />}
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
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
          <FormInput
            label="Confirm Password"
            type="password"
            icon={<FiLock />}
            placeholder="••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
          <p className="login-card__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}