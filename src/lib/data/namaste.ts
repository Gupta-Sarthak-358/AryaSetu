export interface NamasteMapping {
  term: string;
  sanskrit: string;
  namasteCode: string;
  tm2Code: string;
}

export const NAMASTE_DRAFT: NamasteMapping[] = [
  { term: "Generalized anxiety disorder", sanskrit: "Chittodvega", namasteCode: "NAM-D-1042*", tm2Code: "TM2-M04.1*" },
  { term: "Post-COVID-19 fatigue", sanskrit: "Klama", namasteCode: "NAM-S-2210*", tm2Code: "TM2-G18.4*" },
  { term: "Knee osteoarthritis", sanskrit: "Janu Sandhigata Vata", namasteCode: "NAM-V-3307*", tm2Code: "TM2-M19.9*" },
  { term: "Hepatic safety surveillance", sanskrit: "Yakrit", namasteCode: "NAM-Y-0511*", tm2Code: "TM2-K76.8*" },
  { term: "Iron-deficiency anaemia", sanskrit: "Pandu", namasteCode: "NAM-P-0118*", tm2Code: "TM2-D50.9*" },
  { term: "Metabolic syndrome", sanskrit: "Sthaulya spectrum", namasteCode: "NAM-S-2871*", tm2Code: "TM2-E88.8*" },
  { term: "Prediabetes", sanskrit: "Prameha Purvarupa", namasteCode: "NAM-P-1954*", tm2Code: "TM2-R73.0*" },
  { term: "Parkinson's disease", sanskrit: "Kampavata", namasteCode: "NAM-K-0632*", tm2Code: "TM2-G20.9*" },
  { term: "NAFLD", sanskrit: "Yakrit Roga", namasteCode: "NAM-Y-0512*", tm2Code: "TM2-K76.0*" },
  { term: "Mild cognitive impairment", sanskrit: "Smriti Nasha", namasteCode: "NAM-S-2402*", tm2Code: "TM2-F06.7*" },
];

export function namasteFor(indication: string): NamasteMapping | undefined {
  const lower = indication.toLowerCase();
  return NAMASTE_DRAFT.find((m) => lower.includes(m.term.toLowerCase()) || lower.includes(m.sanskrit.toLowerCase()));
}
