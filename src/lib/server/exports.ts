import type { AdverseEvent, Batch, Study } from "../types";

function csv(rows: Record<string, string | number>[], headers: string[]): string {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h] ?? "")).join(","))].join("\n");
}

function seededRand(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return (h % 10000) / 10000;
  };
}

const PRAKRITIS = ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha"];

export function buildSdtmAe(aes: AdverseEvent[]): string {
  return csv(
    aes.map((a, i) => ({
      STUDYID: a.studyId,
      DOMAIN: "AE",
      USUBJID: a.participantId,
      AESEQ: i + 1,
      AETERM: a.term,
      AEPTCD: a.meddraCode,
      AESER: a.seriousness === "Serious" ? "Y" : "N",
      AESEV: a.severity.toUpperCase(),
      AEREL: a.whoUmc.toUpperCase(),
      AEOUT: a.outcome.toUpperCase(),
      AESTDTC: a.onset,
      AERFSTDTC: a.reported,
      AEBODSYS: /hepatic|aminotransferase|bilirubin/i.test(a.meddraPt) ? "Hepatobiliary" : "Other",
      BATCHID: a.batchId ?? "",
    })),
    ["STUDYID", "DOMAIN", "USUBJID", "AESEQ", "AETERM", "AEPTCD", "AESER", "AESEV", "AEREL", "AEOUT", "AESTDTC", "AERFSTDTC", "AEBODSYS", "BATCHID"]
  );
}

export function buildSdtmDm(studies: Study[]): string {
  const rows: Record<string, string | number>[] = [];
  for (const s of studies) {
    const rand = seededRand(s.id);
    const count = Math.min(s.enrolled, 200);
    for (let i = 1; i <= count; i++) {
      const site = s.sites[Math.floor(rand() * s.sites.length)] ?? "SITE-01";
      rows.push({
        STUDYID: s.id,
        DOMAIN: "DM",
        USUBJID: `PT-${s.id.slice(4)}-${String(i).padStart(4, "0")}`,
        SITEID: site,
        AGE: 25 + Math.floor(rand() * 45),
        SEX: rand() > 0.45 ? "F" : "M",
        PRAKRITI: PRAKRITIS[Math.floor(rand() * PRAKRITIS.length)],
        ARM: s.intervention.slice(0, 40),
        RFSTDTC: s.startDate,
      });
    }
  }
  return csv(rows, ["STUDYID", "DOMAIN", "USUBJID", "SITEID", "AGE", "SEX", "PRAKRITI", "ARM", "RFSTDTC"]);
}

export function buildSdtmEx(batches: Batch[]): string {
  const rows: Record<string, string | number>[] = [];
  for (const b of batches) {
    for (const p of b.participantsDosed) {
      rows.push({
        STUDYID: p.studyId,
        DOMAIN: "EX",
        USUBJID: p.participantId,
        EXTRT: b.product,
        EXLOT: b.id,
        EXDOSE: "",
        EXSTDTC: p.firstDose,
        SITEID: p.siteId,
      });
    }
  }
  return csv(rows, ["STUDYID", "DOMAIN", "USUBJID", "EXTRT", "EXLOT", "EXDOSE", "EXSTDTC", "SITEID"]);
}

export function buildAdamAdsl(studies: Study[]): string {
  const rows: Record<string, string | number>[] = [];
  for (const s of studies) {
    const rand = seededRand(s.id + "adsl");
    const count = Math.min(s.enrolled, 200);
    for (let i = 1; i <= count; i++) {
      rows.push({
        STUDYID: s.id,
        USUBJID: `PT-${s.id.slice(4)}-${String(i).padStart(4, "0")}`,
        TRT01A: s.intervention.slice(0, 40),
        TRTSDT: s.startDate,
        AGEGR1: rand() > 0.5 ? "18-44" : "45-75",
        SAFFL: "Y",
        ITTFL: "Y",
      });
    }
  }
  return csv(rows, ["STUDYID", "USUBJID", "TRT01A", "TRTSDT", "AGEGR1", "SAFFL", "ITTFL"]);
}

export function buildDefineXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3" xmlns:def="http://www.cdisc.org/ns/def/v2.1" ODMVersion="1.3.2" FileType="Snapshot" FileOID="ARYASETU-DEMO-001" CreationDateTime="${new Date().toISOString()}" Description="AryaSetu SDTM demo metadata — synthetic data, DEMO dictionaries">
  <Study OID="S.ARYASETU">
    <GlobalVariables>
      <StudyName>AryaSetu AIIA Portfolio (demo)</StudyName>
      <StudyDescription>SDTM demo metadata generated from the AryaSetu database. Synthetic data only.</StudyDescription>
      <ProtocolName>ARYASETU-PORTFOLIO</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.1" Name="SDTM demo metadata">
      <ItemGroupDef OID="IG.DM" Name="DM" Domain="DM" Purpose="Tabulation" def:Structure="One record per subject">
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes"/><ItemRef ItemOID="IT.USUBJID" Mandatory="Yes"/><ItemRef ItemOID="IT.SITEID" Mandatory="Yes"/><ItemRef ItemOID="IT.AGE" Mandatory="No"/><ItemRef ItemOID="IT.SEX" Mandatory="Yes"/><ItemRef ItemOID="IT.PRAKRITI" Mandatory="No"/>
      </ItemGroupDef>
      <ItemGroupDef OID="IG.AE" Name="AE" Domain="AE" Purpose="Tabulation" def:Structure="One record per adverse event per subject">
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes"/><ItemRef ItemOID="IT.USUBJID" Mandatory="Yes"/><ItemRef ItemOID="IT.AE.AETERM" Mandatory="Yes"/><ItemRef ItemOID="IT.AE.AEPTCD" Mandatory="No"/><ItemRef ItemOID="IT.AE.AEREL" Mandatory="Yes"/><ItemRef ItemOID="IT.AE.AESER" Mandatory="Yes"/>
      </ItemGroupDef>
      <ItemGroupDef OID="IG.EX" Name="EX" Domain="EX" Purpose="Tabulation" def:Structure="One record per exposure per subject">
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes"/><ItemRef ItemOID="IT.USUBJID" Mandatory="Yes"/><ItemRef ItemOID="IT.EX.EXTRT" Mandatory="Yes"/><ItemRef ItemOID="IT.EX.EXLOT" Mandatory="No"/>
      </ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>`;
}

export function buildOdmXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3" ODMVersion="1.3.2" FileType="Snapshot" FileOID="ARYASETU-CDASH-DEMO" CreationDateTime="${new Date().toISOString()}" Description="CDASH-aligned demo instruments (draft)">
  <Study OID="S.CDASH.DEMO">
    <GlobalVariables><StudyName>AryaSetu CDASH instruments (draft)</StudyName></GlobalVariables>
    <MetaDataVersion OID="MDV.CDASH.1" Name="CDASH demo instruments">
      <FormDef OID="F.AE" Name="Adverse Event Report" Repeating="Yes">
        <ItemRef ItemOID="I.AETERM" Mandatory="Yes"/><ItemRef ItemOID="I.AESTDAT" Mandatory="Yes"/><ItemRef ItemOID="I.AEOUT" Mandatory="No"/><ItemRef ItemOID="I.AEREL" Mandatory="Yes"/><ItemRef ItemOID="I.AESER" Mandatory="Yes"/><ItemRef ItemOID="I.BATCHID" Mandatory="No"/>
      </FormDef>
      <FormDef OID="F.DM" Name="Demographics" Repeating="No">
        <ItemRef ItemOID="I.BRTHDTC" Mandatory="No"/><ItemRef ItemOID="I.SEX" Mandatory="Yes"/><ItemRef ItemOID="I.PRAKRITI" Mandatory="No"/>
      </FormDef>
      <FormDef OID="F.VS" Name="Vital Signs" Repeating="Yes">
        <ItemRef ItemOID="I.VSDAT" Mandatory="Yes"/><ItemRef ItemOID="I.SYSBP" Mandatory="No"/><ItemRef ItemOID="I.DIABP" Mandatory="No"/><ItemRef ItemOID="I.PULSE" Mandatory="No"/>
      </FormDef>
    </MetaDataVersion>
  </Study>
</ODM>`;
}
