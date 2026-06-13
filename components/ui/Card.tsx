import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function Card({ title, eyebrow, action, children, className = "", ...props }: CardProps) {
  return (
    <section className={`card ${className}`} {...props}>
      {(title || eyebrow || action) && (
        <div className="card__header">
          <div>
            {eyebrow ? <span>{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
