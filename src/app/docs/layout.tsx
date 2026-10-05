import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C2A21]">
      <header className="border-b border-[#E3DED4] bg-[#FAF9F6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
              <Activity size={14} />
            </span>
            <span className="text-[14px] font-semibold">ARYASETU · Docs</span>
          </Link>
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-[#4A5A4F] hover:text-[#1C2A21]">
            <ArrowLeft size={13} /> Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
