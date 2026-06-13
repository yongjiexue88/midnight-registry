"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

type ModalProps = {
  title: string;
  kicker?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, kicker, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <Button variant="icon" icon="fa-xmark" className="modal__close" onClick={onClose} aria-label="Close modal" />
        {kicker ? <span className="modal__kicker">{kicker}</span> : null}
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
