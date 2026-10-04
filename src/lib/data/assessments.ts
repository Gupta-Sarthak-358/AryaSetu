const CATS = ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha"];

function seededRand(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return (h % 10000) / 10000;
  };
}

export interface PrakritiAssessment {
  participantId: string;
  assessorA: string;
  assessorB: string;
  ratingA: string;
  ratingB: string;
}

export function getAssessments(studyId: string): { assessorA: string; assessorB: string; rows: PrakritiAssessment[] } {
  const rand = seededRand(studyId + "-prakriti-reliability");
  const assessorA = "Vd. S. Pillai (Sr.)";
  const assessorB = "Vd. R. Iyer (Jr.)";
  const rows: PrakritiAssessment[] = [];
  for (let i = 1; i <= 24; i++) {
    const ratingA = CATS[Math.floor(rand() * CATS.length)];
    const ratingB = rand() < 0.64 ? ratingA : CATS[Math.floor(rand() * CATS.length)];
    rows.push({
      participantId: `PT-${studyId.slice(4)}-${String(i).padStart(4, "0")}`,
      assessorA,
      assessorB,
      ratingA,
      ratingB,
    });
  }
  return { assessorA, assessorB, rows };
}
