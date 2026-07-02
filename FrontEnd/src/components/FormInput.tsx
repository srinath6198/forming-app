import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, fullWidth, className = "", ...props }, ref) => {
    const fieldClass = fullWidth ? "form-field form-grid--full" : "form-field";

    return (
      <label className={fieldClass}>
        {label && <span className="form-label">{label}</span>}
        {icon ? (
          <div className="form-input-wrap">
            <span className="form-icon">{icon}</span>
            <input ref={ref} className={`form-input form-input--icon ${className}`.trim()} {...props} />
          </div>
        ) : (
          <input ref={ref} className={`form-input ${className}`.trim()} {...props} />
        )}
        {error && <span className="form-error">{error}</span>}
      </label>
    );
  },
);

FormInput.displayName = "FormInput";
