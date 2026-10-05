export interface XptVar {
  name: string;
  label: string;
  type: "num" | "char";
  len: number;
}

function pad(s: string, n: number): Buffer {
  const b = Buffer.alloc(n, 0x20);
  b.write(s.slice(0, n).toUpperCase(), "ascii");
  return b;
}

function rec(s: string): Buffer {
  const b = Buffer.alloc(80, 0x20);
  b.write(s, "ascii");
  return b;
}

function sasDatetime(d = new Date()): string {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const p2 = (x: number) => String(x).padStart(2, "0");
  return `${p2(d.getDate())}${months[d.getMonth()]}${String(d.getFullYear()).slice(2)}:${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
}

export function toIbmFloat(value: number): Buffer {
  const buf = Buffer.alloc(8, 0);
  if (!Number.isFinite(value) || value === 0) return buf;
  const sign = value < 0 ? 0x80 : 0;
  let a = Math.abs(value);
  let e = 0;
  while (a >= 1) { a /= 16; e++; }
  while (a < 1 / 16) { a *= 16; e--; }
  let frac = BigInt(Math.round(a * Math.pow(2, 56)));
  if (frac >= BigInt(1) << BigInt(56)) {
    frac = frac >> BigInt(4);
    e++;
  }
  buf[0] = sign | (64 + e);
  for (let i = 7; i >= 1; i--) {
    buf[i] = Number(frac & BigInt(0xff));
    frac = frac >> BigInt(8);
  }
  return buf;
}

export function fromIbmFloat(buf: Buffer): number {
  if (buf.every((b) => b === 0)) return 0;
  const sign = buf[0] & 0x80 ? -1 : 1;
  const e = (buf[0] & 0x7f) - 64;
  let frac = BigInt(0);
  for (let i = 1; i < 8; i++) frac = (frac << BigInt(8)) | BigInt(buf[i]);
  return sign * Number(frac) / Math.pow(2, 56) * Math.pow(16, e);
}

function namestr(v: XptVar, varNum: number, position: number): Buffer {
  const b = Buffer.alloc(140, 0x20);
  b.writeInt16BE(v.type === "num" ? 1 : 2, 0);
  b.writeInt16BE(0, 2);
  b.writeInt16BE(v.len, 4);
  b.writeInt16BE(varNum, 6);
  pad(v.name, 8).copy(b, 8);
  pad(v.label, 40).copy(b, 16);
  pad("", 8).copy(b, 56);
  b.writeInt16BE(0, 64);
  b.writeInt16BE(0, 66);
  b.writeInt16BE(0, 68);
  b.writeInt16BE(0, 70);
  pad("", 8).copy(b, 72);
  b.writeInt16BE(0, 80);
  b.writeInt16BE(0, 82);
  b.writeInt32BE(position, 84);
  return b;
}

export function buildXpt(dsName: string, dsLabel: string, vars: XptVar[], rows: (string | number)[][]): Buffer {
  const parts: Buffer[] = [];
  const dt = sasDatetime();
  parts.push(rec("HEADER RECORD*******LIBRARY HEADER RECORD!!!!!!!000000000000000000000000000000"));
  parts.push(rec(`SAS     SAS     SASLIB  9.4     X64_10PE                        ${dt}`));
  parts.push(rec(""));
  parts.push(rec("HEADER RECORD*******MEMBER  HEADER RECORD!!!!!!!000000000000000001600000000140"));
  parts.push(rec("HEADER RECORD*******DSCRPTR HEADER RECORD!!!!!!!000000000000000000000000000000"));
  parts.push(rec(`SAS     ${dsName.padEnd(8, " ").slice(0, 8)}SASDATA 9.4     X64_10PE                        ${dt}`));
  parts.push(rec(dsLabel.slice(0, 40)));
  parts.push(rec("HEADER RECORD*******VARDESC HEADER RECORD!!!!!!!000000000000000000000000000000"));

  let pos = 0;
  vars.forEach((v, i) => {
    parts.push(namestr(v, i + 1, pos));
    pos += v.len;
  });

  parts.push(rec("HEADER RECORD*******OBS     HEADER RECORD!!!!!!!000000000000000000000000000000"));

  for (const row of rows) {
    const cells = row.map((cell, i) => {
      const v = vars[i];
      if (v.type === "num") {
        return toIbmFloat(typeof cell === "number" ? cell : parseFloat(cell) || 0);
      }
      return pad(String(cell), v.len);
    });
    parts.push(Buffer.concat(cells));
  }

  return Buffer.concat(parts);
}
