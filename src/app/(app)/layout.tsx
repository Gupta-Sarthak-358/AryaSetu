import { redirect } from "next/navigation";
import { RoleProvider } from "@/lib/role";
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
      <Sidebar />
      <div className="ml-[208px] flex min-h-screen flex-col">
        <Topbar sessionName={user.name} sessionRole={user.role} />
        <main className="flex-1 px-5 pt-5 pb-14">{children}</main>
      </div>
      <Ticker />
    </RoleProvider>
  );
}
