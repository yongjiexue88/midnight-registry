import type { ReactNode } from "react";

type SidePanelProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SidePanel({ title, eyebrow, action, children }: SidePanelProps) {
  return (
    <aside className="side-panel">
      <div className="side-panel__header">
        <div>
          {eyebrow ? <span>{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </aside>
  );
}
