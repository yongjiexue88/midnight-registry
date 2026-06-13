import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  icon?: string;
  children?: ReactNode;
};

export function Button({ variant = "primary", icon, children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`btn btn--${variant} ${className}`} type="button" {...props}>
      {icon ? <i className={`fa-solid ${icon}`} aria-hidden="true" /> : null}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
