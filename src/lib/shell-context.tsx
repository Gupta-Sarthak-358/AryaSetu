"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ShellContextType {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  isCommandOpen: boolean;
  setIsCommandOpen: (open: boolean) => void;
}

const ShellContext = createContext<ShellContextType>({
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  toggleMobile: () => {},
  isCommandOpen: false,
  setIsCommandOpen: () => {},
});

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ShellContext.Provider
      value={{
        isMobileOpen,
        setIsMobileOpen,
        toggleMobile,
        isCommandOpen,
        setIsCommandOpen,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  return useContext(ShellContext);
}
