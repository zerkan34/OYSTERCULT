import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-md border border-white/10 bg-white/5",
              "px-4 py-2 text-base text-white",
              "placeholder:text-white/40",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              error && "border-destructive focus:ring-destructive",
              className
            )}
            ref={ref}
            id={inputId}
            aria-invalid={error ? "true" : undefined}
            aria-errormessage={error ? errorId : undefined}
            aria-describedby={helperText ? helperId : undefined}
            {...(type === "password" && {
              autoComplete: "current-password",
              "data-lpignore": true,
            })}
            {...(type === "email" && {
              autoComplete: "email",
              inputMode: "email",
            })}
            {...(type === "tel" && {
              autoComplete: "tel",
              inputMode: "tel",
              pattern: "[0-9]*",
            })}
            {...(type === "search" && {
              role: "searchbox",
              "aria-label": props.placeholder || "Search",
            })}
            {...props}
          />
        </div>
        {error && (
          <p
            className="mt-2 text-sm text-destructive"
            id={errorId}
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            className="mt-2 text-sm text-white/60"
            id={helperId}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
