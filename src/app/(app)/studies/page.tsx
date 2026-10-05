import { PageHeader } from "@/components/ui";
import { StudiesLedger } from "@/components/StudiesLedger";
import { getStudies } from "@/lib/server/repo";
import { fmtNum } from "@/lib/utils";

export default async function StudiesPage() {
  const studies = await getStudies();
  const portfolioTotals = {
    enrolled: studies.reduce((a, s) => a + s.enrolled, 0),
    target: studies.reduce((a, s) => a + s.target, 0),
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clinical Trial Register"
        sub={`${studies.length} registered Ayurveda studies · ${fmtNum(portfolioTotals.enrolled)} participants enrolled of ${fmtNum(portfolioTotals.target)} quota · 8 clinical research sites`}
      />
      <StudiesLedger studies={studies} />
    </div>
  );
}
