"use client";

import { useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onOpenChange(false);
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/60"
      style={{ padding: 0, border: "none", backgroundColor: "transparent" }}
    >
      <div className="mx-auto my-auto bg-background rounded-3xl p-0 shadow-2xl max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden border border-border flex flex-col">
        {children}
      </div>
    </dialog>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
}

export function DialogContent({ children }: DialogContentProps) {
  return <div className="flex flex-col h-full">{children}</div>;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="border-b border-border px-8 py-6 flex-shrink-0">
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-2xl font-bold text-foreground">{children}</h2>;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
}

interface DialogBodyProps {
  children: React.ReactNode;
}

export function DialogBody({ children }: DialogBodyProps) {
  return <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="border-t border-border px-8 py-6 flex items-center justify-between flex-shrink-0">
      {children}
    </div>
  );
}
