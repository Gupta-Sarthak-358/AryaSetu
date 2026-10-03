import type { Site } from "../types";

export const sites: Site[] = [
  { id: "SITE-01", name: "AIIA — All India Institute of Ayurveda", city: "New Delhi", state: "Delhi", pi: "Dr. Meera Kulkarni", activated: "2026-02-10", target: 420, screened: 512, enrolled: 402, status: "Active" },
  { id: "SITE-02", name: "IPGT&RA — Gujarat Ayurved University", city: "Jamnagar", state: "Gujarat", pi: "Dr. Rajesh Bhatt", activated: "2026-02-18", target: 340, screened: 391, enrolled: 318, status: "Active" },
  { id: "SITE-03", name: "NIA — National Institute of Ayurveda", city: "Jaipur", state: "Rajasthan", pi: "Dr. Sunita Sharma", activated: "2026-03-02", target: 300, screened: 287, enrolled: 224, status: "Active" },
  { id: "SITE-04", name: "BHU — Faculty of Ayurveda, IMS", city: "Varanasi", state: "Uttar Pradesh", pi: "Dr. Anil Tripathi", activated: "2026-03-09", target: 260, screened: 244, enrolled: 176, status: "Active" },
  { id: "SITE-05", name: "SDM College of Ayurveda", city: "Hassan", state: "Karnataka", pi: "Dr. Prakash Hegde", activated: "2026-03-21", target: 220, screened: 173, enrolled: 118, status: "Active" },
  { id: "SITE-06", name: "Arya Vaidya Sala", city: "Kottakkal", state: "Kerala", pi: "Dr. Lakshmi Warrier", activated: "2026-04-04", target: 180, screened: 141, enrolled: 92, status: "Active" },
  { id: "SITE-07", name: "CCRAS Regional Research Institute", city: "Patna", state: "Bihar", pi: "Dr. Vikram Singh", activated: "2026-04-19", target: 140, screened: 88, enrolled: 47, status: "Active" },
  { id: "SITE-08", name: "State Ayurvedic College", city: "Guwahati", state: "Assam", pi: "Dr. Nabanita Das", activated: "2026-05-11", target: 100, screened: 41, enrolled: 19, status: "Initiating" },
];

export function siteById(id: string) {
  return sites.find((s) => s.id === id);
}
