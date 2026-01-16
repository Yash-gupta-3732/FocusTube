"use client";

import { useEffect } from "react";

export default function ClientCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    navigator.serviceWorker?.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }, []);

  return null;
}
