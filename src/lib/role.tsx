"use client";

import { createContext, useContext, useState } from "react";
import type { Role } from "@/lib/types";
import { personas } from "@/lib/data/personas";

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
}

const Ctx = createContext<RoleCtx>({ role: "Admin", setRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === "undefined") return "Admin";
    const stored = window.localStorage.getItem("aryasetu-role") as Role | null;
    return stored && personas.some((p) => p.role === stored) ? stored : "Admin";
  });

  const setRole = (r: Role) => {
    setRoleState(r);
    window.localStorage.setItem("aryasetu-role", r);
  };

  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}

export function useRole() {
  return useContext(Ctx);
}

export function usePersona() {
  const { role } = useRole();
  return personas.find((p) => p.role === role) ?? personas[0];
}
