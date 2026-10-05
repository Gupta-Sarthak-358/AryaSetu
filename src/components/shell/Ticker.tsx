import { getTickerEvents } from "@/lib/server/repo";

const kindColor: Record<string, string> = {
  safety: "text-[#A44A2A]",
  enrolment: "text-[#2D5A3D]",
  query: "text-[#8A6A1F]",
  regulatory: "text-[#3E6B8C]",
  audit: "text-[#6B5A8C]",
  visit: "text-[#7A887D]",
};

export async function Ticker() {
  const tickerEvents = await getTickerEvents();
  const items = [...tickerEvents, ...tickerEvents];
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3DED4] bg-[#F3EFE5]">
      <div className="ml-[208px] flex items-center overflow-hidden">
        <span className="z-10 shrink-0 border-r border-[#E3DED4] bg-[#F3EFE5] px-4 py-[7px] text-[11px] font-semibold text-[#4A5A4F]">
          Latest events
        </span>
        <div className="ticker-track">
          {items.map((e, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2 border-r border-[#E3DED4] px-4 py-[7px] font-mono2 text-[10.5px] whitespace-nowrap">
              <span className="text-[#7A887D]">{e.ts}</span>
              <span className={`${kindColor[e.kind]}`}>{e.kind}</span>
              <span className="text-[#4A5A4F]">{e.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
