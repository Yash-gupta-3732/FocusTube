"use client";

import { ReactNode, useEffect } from "react";

interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function MobileBottomSheet({
  open,
  onClose,
  children,
}: MobileBottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60"
      />

      {/* CONTAINER */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        {/* SHEET / MODAL */}
        <div
          className="
            w-full
            md:w-130
            max-h-[85vh]
            overflow-y-auto
            bg-neutral-900
            p-4
            shadow-xl

            rounded-t-2xl md:rounded-2xl
            animate-sheet
          "
        >
          {/* DRAG HANDLE (mobile only) */}
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-700 md:hidden" />

          {children}
        </div>
      </div>
    </>
  );
}
