import { RoleProvider } from "@/lib/role";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { Ticker } from "@/components/shell/Ticker";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <Sidebar />
      <div className="ml-[208px] flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 px-5 pt-5 pb-14">{children}</main>
      </div>
      <Ticker />
    </RoleProvider>
  );
}
