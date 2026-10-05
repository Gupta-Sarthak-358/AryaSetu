import { redirect } from "next/navigation";
import { RoleProvider } from "@/lib/role";
import { ShellProvider } from "@/lib/shell-context";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { Ticker } from "@/components/shell/Ticker";
import { getSessionUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <RoleProvider>
      <ShellProvider>
        <Sidebar />
        <div className="flex min-h-screen flex-col transition-[margin] lg:ml-[216px]">
          <Topbar sessionName={user.name} sessionRole={user.role} />
          <main className="flex-1 px-4 pt-4 pb-16 sm:px-6">{children}</main>
        </div>
        <Ticker />
      </ShellProvider>
    </RoleProvider>
  );
}
