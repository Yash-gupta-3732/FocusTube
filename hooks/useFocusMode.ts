// This directive tells Next.js that this hook runs only on the client
// because it uses browser-only APIs like `window`
"use client";

import { useEffect } from "react";

// Custom hook to enable or disable Focus Mode
// `enabled` controls whether focus locking is active
export function useFocusMode(enabled: boolean) {

  useEffect(() => {

    // If focus mode is not enabled, do nothing
    // (no event listeners are attached)
    if (!enabled) return;

    // Function to block specific keyboard shortcuts
    const blockKeys = (e: KeyboardEvent) => {

      // Keys that are commonly used to escape focus or navigate away
      const blockedKeys = ["Escape", "Tab", "Backspace"];

      // Condition:
      // 1. If the pressed key is in blockedKeys
      // OR
      // 2. If Ctrl is pressed along with:
      //    - L (address bar)
      //    - R (reload)
      //    - W (close tab)
      //    - T (new tab)
      if (
        blockedKeys.includes(e.key) ||
        (e.ctrlKey && ["l", "r", "w", "t"].includes(e.key.toLowerCase()))
      ) {
        // Prevent the browser’s default behavior
        // This is what actually "locks" the focus
        e.preventDefault();
      }
    };

    // Function to block right-click context menu
    // This prevents opening "Watch on YouTube" or inspect menu
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Attach keyboard listener to the window
    window.addEventListener("keydown", blockKeys);

    // Attach right-click listener to the window
    window.addEventListener("contextmenu", blockContextMenu);

    // Cleanup function:
    // This runs when:
    // - Focus Mode is turned OFF
    // - Component unmounts
    return () => {

      // Remove keyboard listener to restore normal behavior
      window.removeEventListener("keydown", blockKeys);

      // Remove right-click block to restore context menu
      window.removeEventListener("contextmenu", blockContextMenu);
    };

  // Re-run this effect whenever `enabled` changes
  }, [enabled]);
}
