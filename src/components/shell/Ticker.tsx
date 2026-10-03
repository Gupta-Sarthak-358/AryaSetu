import { tickerEvents } from "@/lib/data/ops";

const kindColor: Record<string, string> = {
  safety: "text-red-400",
  enrolment: "text-emerald-400",
  query: "text-amber-400",
  regulatory: "text-sky-400",
  audit: "text-violet-400",
  visit: "text-zinc-500",
};

export function Ticker() {
  const items = [...tickerEvents, ...tickerEvents];
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1c1c20] bg-[#0d0d0f]">
      <div className="ml-[208px] flex items-center overflow-hidden">
        <span className="z-10 shrink-0 border-r border-[#1c1c20] bg-[#0d0d0f] px-4 py-[7px] font-mono2 text-[9.5px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          Event feed
        </span>
        <div className="ticker-track">
          {items.map((e, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2 border-r border-[#16161a] px-4 py-[7px] font-mono2 text-[10.5px] whitespace-nowrap">
              <span className="text-zinc-700">{e.ts}</span>
              <span className={`uppercase ${kindColor[e.kind]}`}>[{e.kind}]</span>
              <span className="text-zinc-500">{e.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
