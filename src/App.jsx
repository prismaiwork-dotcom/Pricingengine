import { useState, useEffect, useMemo } from "react";

// ── BRAND TOKENS — CUEGENT AI ────────────────────────────────────────────
const B = {
  bg:        "#06080c",
  surface:   "#0d1117",
  card:      "#141b24",
  glass:     "rgba(255,255,255,0.03)",
  border:    "rgba(56,189,248,0.15)",
  borderHi:  "rgba(56,189,248,0.35)",
  primary:   "#38bdf8",
  primary600:"#0284c7",
  primary400:"#7dd3fc",
  primary200:"#bae6fd",
  accent:    "#f59e0b",
  accent400: "#fbbf24",
  teal:      "#2dd4bf",
  text:      "#e8edf3",
  textBright:"#f8fafc",
  muted:     "#5c6b7f",
  mutedLight:"#8494a7",
  success:   "#34d399",
  danger:    "#fb7185",
  warning:   "#fbbf24",
};

const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SF Mono', monospace";
const FONT_HEADING = "'Inter', -apple-system, sans-serif";

// ── HISTORICAL QUOTES ─────────────────────────────────────────────────────
const HISTORICAL_QUOTES = [
  { quote_id:"Q-2024-001", customer:"Bell Helicopter",   industry:"Aerospace",  material:"Aluminum",       size_length_in:"4",   size_width_in:"2",    quantity:"50",  unit_price_usd:"12.5", won_lost:"Won" },
  { quote_id:"Q-2024-002", customer:"Peterbilt Motors",  industry:"Automotive", material:"Stainless Steel", size_length_in:"3",   size_width_in:"2",    quantity:"200", unit_price_usd:"8.75", won_lost:"Won" },
  { quote_id:"Q-2024-003", customer:"Lockheed Martin",   industry:"Defense",    material:"Aluminum",       size_length_in:"6",   size_width_in:"4",    quantity:"25",  unit_price_usd:"28",   won_lost:"Won" },
  { quote_id:"Q-2024-004", customer:"John Deere",        industry:"Automotive", material:"Aluminum",       size_length_in:"5",   size_width_in:"3",    quantity:"500", unit_price_usd:"4.2",  won_lost:"Won" },
  { quote_id:"Q-2024-005", customer:"Medtronic",         industry:"Medical",    material:"Stainless Steel", size_length_in:"2",   size_width_in:"1",    quantity:"100", unit_price_usd:"15",   won_lost:"Won" },
  { quote_id:"Q-2024-006", customer:"Bell Helicopter",   industry:"Aerospace",  material:"Aluminum",       size_length_in:"2",   size_width_in:"1",    quantity:"300", unit_price_usd:"6.8",  won_lost:"Won" },
  { quote_id:"Q-2024-008", customer:"US Army",           industry:"Defense",    material:"Stainless Steel", size_length_in:"8",   size_width_in:"4",    quantity:"40",  unit_price_usd:"42",   won_lost:"Won" },
  { quote_id:"Q-2024-009", customer:"Caterpillar",       industry:"Automotive", material:"Aluminum",       size_length_in:"5",   size_width_in:"3",    quantity:"250", unit_price_usd:"9.2",  won_lost:"Won" },
  { quote_id:"Q-2024-010", customer:"Boston Scientific", industry:"Medical",    material:"Titanium",       size_length_in:"1.5", size_width_in:"0.75", quantity:"75",  unit_price_usd:"38",   won_lost:"Won" },
  { quote_id:"Q-2024-011", customer:"Northrop Grumman",  industry:"Defense",    material:"Aluminum",       size_length_in:"10",  size_width_in:"6",    quantity:"20",  unit_price_usd:"65",   won_lost:"Won" },
  { quote_id:"Q-2024-013", customer:"Stryker",           industry:"Medical",    material:"Stainless Steel", size_length_in:"1.5", size_width_in:"0.5",  quantity:"200", unit_price_usd:"18.5", won_lost:"Won" },
  { quote_id:"Q-2024-014", customer:"Boeing",            industry:"Aerospace",  material:"Aluminum",       size_length_in:"8",   size_width_in:"4",    quantity:"60",  unit_price_usd:"22",   won_lost:"Won" },
  { quote_id:"Q-2024-021", customer:"Airbus",            industry:"Aerospace",  material:"Aluminum",       size_length_in:"6",   size_width_in:"3",    quantity:"100", unit_price_usd:"19.5", won_lost:"Won" },
  { quote_id:"Q-2024-025", customer:"Textron",           industry:"Aerospace",  material:"Stainless Steel", size_length_in:"5",   size_width_in:"3",    quantity:"45",  unit_price_usd:"38",   won_lost:"Won" },
  { quote_id:"Q-2024-030", customer:"Sikorsky",          industry:"Aerospace",  material:"Aluminum",       size_length_in:"3",   size_width_in:"2",    quantity:"70",  unit_price_usd:"24",   won_lost:"Won" },
];

// ── SAMPLE AUDIT DATA ────────────────────────────────────────────────────
const SAMPLE_AUDIT_DATA = [
  { requestId:"QR-S001", timestamp:"2026-03-14T09:12:33.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Bell Helicopter", customerEmail:"procurement@bellhelicopter.com", industry:"Aerospace", part:"Data Plate - Engine Serial", material:"Aluminum", size:"4 x 2 x 0.063 in", quantity:"75", finish:"Anodized Black", marking:"Laser Engraved", rush:"No", notes:"", unitPrice:"17.17", finalPrice:"17.17", priceRange:"15.46 - 19.75", total:"1287.75", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S002", timestamp:"2026-03-13T14:45:10.000Z", status:"Escalated", submittedBy:"James Rivera", customer:"Lockheed Martin", customerEmail:"quotes@lockheedmartin.com", industry:"Defense", part:"Airframe Plate", material:"Aluminum", size:"10 x 6 x 0.08 in", quantity:"20", finish:"Alodine", marking:"Chemical Etch", rush:"Yes", notes:"ITAR controlled", unitPrice:"97.50", finalPrice:"", priceRange:"87.75 - 112.13", total:"1950.00", confidence:"MEDIUM", approvedBy:"" },
  { requestId:"QR-S003", timestamp:"2026-03-13T11:22:05.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Boeing", customerEmail:"sourcing@boeing.com", industry:"Aerospace", part:"Landing Gear Plate", material:"Stainless Steel", size:"5 x 3 x 0.05 in", quantity:"45", finish:"Passivated", marking:"Laser Engraved", rush:"No", notes:"AS9100 required", unitPrice:"38.00", finalPrice:"36.50", priceRange:"34.20 - 43.70", total:"1642.50", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S004", timestamp:"2026-03-12T16:08:41.000Z", status:"Rejected", submittedBy:"Carlos Vega", customer:"Tesla Motors", customerEmail:"procurement@tesla.com", industry:"Automotive", part:"VIN Plate - Cab Door", material:"Aluminum", size:"3 x 2 x 0.04 in", quantity:"1000", finish:"Anodized", marking:"Laser Engraved", rush:"No", notes:"Customer requested lower price", unitPrice:"7.83", finalPrice:"", priceRange:"7.05 - 9.01", total:"7830.00", confidence:"MEDIUM", approvedBy:"" },
  { requestId:"QR-S005", timestamp:"2026-03-12T10:33:18.000Z", status:"Approved", submittedBy:"James Rivera", customer:"Medtronic", customerEmail:"vendor@medtronic.com", industry:"Medical", part:"Surgical Instrument Tag", material:"Stainless Steel", size:"1.5 x 0.5 x 0.03 in", quantity:"200", finish:"Electropolished", marking:"Laser Engraved", rush:"No", notes:"FDA UDI compliant", unitPrice:"18.50", finalPrice:"18.50", priceRange:"16.65 - 21.28", total:"3700.00", confidence:"HIGH", approvedBy:"James Rivera" },
  { requestId:"QR-S006", timestamp:"2026-03-11T08:55:02.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Caterpillar", customerEmail:"purchasing@cat.com", industry:"Automotive", part:"Equipment Nameplate", material:"Aluminum", size:"5 x 3 x 0.063 in", quantity:"250", finish:"Anodized Black", marking:"Embossed", rush:"No", notes:"", unitPrice:"9.20", finalPrice:"9.20", priceRange:"8.28 - 10.58", total:"2300.00", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S007", timestamp:"2026-03-11T13:20:55.000Z", status:"Escalated", submittedBy:"Carlos Vega", customer:"Northrop Grumman", customerEmail:"contracts@northropgrumman.com", industry:"Defense", part:"Electronics Panel ID", material:"Stainless Steel", size:"8 x 4 x 0.05 in", quantity:"30", finish:"Passivated", marking:"Chemical Etch", rush:"Yes", notes:"ITAR controlled, classified project", unitPrice:"52.50", finalPrice:"", priceRange:"47.25 - 60.38", total:"1575.00", confidence:"MEDIUM", approvedBy:"" },
  { requestId:"QR-S008", timestamp:"2026-03-10T15:42:30.000Z", status:"Approved", submittedBy:"James Rivera", customer:"Stryker", customerEmail:"procurement@stryker.com", industry:"Medical", part:"Implant ID Tag", material:"Titanium", size:"1.5 x 0.75 x 0.02 in", quantity:"100", finish:"Electropolished", marking:"Laser Engraved", rush:"No", notes:"ISO 13485, biocompatible", unitPrice:"38.00", finalPrice:"38.00", priceRange:"34.20 - 43.70", total:"3800.00", confidence:"HIGH", approvedBy:"James Rivera" },
  { requestId:"QR-S009", timestamp:"2026-03-10T09:15:44.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Airbus", customerEmail:"supply.chain@airbus.com", industry:"Aerospace", part:"Interior Panel Placard", material:"Aluminum", size:"6 x 3 x 0.04 in", quantity:"150", finish:"Anodized", marking:"Silkscreen", rush:"No", notes:"", unitPrice:"19.50", finalPrice:"18.75", priceRange:"17.55 - 22.43", total:"2812.50", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S010", timestamp:"2026-03-09T11:30:12.000Z", status:"Rejected", submittedBy:"Carlos Vega", customer:"General Dynamics", customerEmail:"quotes@gd.com", industry:"Defense", part:"Warning Label", material:"Polyester", size:"4 x 2 x 0.01 in", quantity:"500", finish:"None", marking:"Digital Print", rush:"No", notes:"Budget constraints", unitPrice:"3.20", finalPrice:"", priceRange:"2.88 - 3.68", total:"1600.00", confidence:"LOW", approvedBy:"" },
  { requestId:"QR-S011", timestamp:"2026-03-08T14:05:28.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Peterbilt Motors", customerEmail:"purchasing@peterbilt.com", industry:"Automotive", part:"Bumper ID Plate", material:"Stainless Steel", size:"3 x 2 x 0.05 in", quantity:"300", finish:"Brushed", marking:"Embossed", rush:"No", notes:"", unitPrice:"8.75", finalPrice:"8.75", priceRange:"7.88 - 10.06", total:"2625.00", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S012", timestamp:"2026-03-07T10:48:33.000Z", status:"Approved", submittedBy:"James Rivera", customer:"Boston Scientific", customerEmail:"vendor.mgmt@bsci.com", industry:"Medical", part:"Device Serial Plate", material:"Titanium", size:"1.5 x 0.75 x 0.02 in", quantity:"75", finish:"Electropolished", marking:"Laser Engraved", rush:"Yes", notes:"Urgent production run", unitPrice:"47.50", finalPrice:"45.00", priceRange:"34.20 - 43.70", total:"3375.00", confidence:"HIGH", approvedBy:"Owner" },
];

// ── AUDIT TRAIL HELPERS ──────────────────────────────────────────────────
const AUDIT_KEY = "prism_audit_trail";

function getAuditTrail() {
  try {
    const stored = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    if (stored.length === 0) return [...SAMPLE_AUDIT_DATA];
    return stored;
  } catch { return [...SAMPLE_AUDIT_DATA]; }
}

function saveAuditEntry(entry) {
  const trail = getAuditTrail();
  trail.unshift(entry);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(trail));
}

function exportToCSV(data) {
  if (!data.length) return;
  const headers = ["Request ID","Date","Customer","Part","Material","Quantity","Recommended Price","Final Approved Price","Confidence","Status","Approved By","Email","Industry","Size","Finish","Marking","Rush","Total","Notes"];
  const rows = data.map(r => [
    r.requestId, r.timestamp, r.customer, r.part, r.material, r.quantity,
    r.unitPrice, r.finalPrice || "", r.confidence, r.status, r.approvedBy || "",
    r.customerEmail, r.industry, r.size, r.finish, r.marking, r.rush,
    r.total, r.notes || "",
  ].map(v => `"${String(v || "").replace(/"/g, '""')}"`));
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cuegent_Audit_Trail_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── PRICING ENGINE ────────────────────────────────────────────────────────
function calculatePrice(form) {
  const similar = HISTORICAL_QUOTES.filter(q => {
    const matMatch = q.material.toLowerCase().includes(form.material.toLowerCase()) ||
                     form.material.toLowerCase().includes(q.material.toLowerCase());
    const indMatch = q.industry.toLowerCase() === form.industry.toLowerCase();
    return matMatch && indMatch && q.won_lost === "Won";
  });
  const priced = similar.map(q => {
    const area = parseFloat(q.size_length_in) * parseFloat(q.size_width_in);
    const ppsqin = parseFloat(q.unit_price_usd) / area;
    return { ...q, ppsqin };
  }).filter(q => !isNaN(q.ppsqin));
  const area  = parseFloat(form.length) * parseFloat(form.width);
  const avg   = priced.length > 0 ? priced.reduce((s, q) => s + q.ppsqin, 0) / priced.length : 0;
  const base  = avg * area;
  const rush  = form.rush === "Yes" ? 1.25 : 1.0;
  const unit  = (base * rush).toFixed(2);
  const total = (unit * parseInt(form.quantity || 1)).toFixed(2);
  const conf  = priced.length >= 5 ? "HIGH" : priced.length >= 2 ? "MEDIUM" : "LOW";
  const avgPpsqin = avg.toFixed(2);
  const topComps = priced.slice(0, 3);
  const custList = [...new Set(topComps.map(q => q.customer))].join(", ");
  const rationale = [];
  rationale.push(`Recommended price of $${(base * rush).toFixed(2)}/unit is derived from ${priced.length} historical won quotes in ${form.industry} using ${form.material}, averaging $${avgPpsqin}/sq.in across a ${area} sq.in part area.`);
  if (priced.length > 0) {
    const prices = priced.map(q => parseFloat(q.unit_price_usd));
    rationale.push(`Historical unit prices for comparable orders range from $${Math.min(...prices).toFixed(2)} to $${Math.max(...prices).toFixed(2)}.${custList ? ` Key reference accounts: ${custList}.` : ""}`);
  }
  const qty = parseInt(form.quantity || 1);
  if (qty >= 200) rationale.push(`Volume of ${qty} units positions this as a mid-to-high volume order — pricing reflects economies of scale.`);
  else if (qty <= 30) rationale.push(`Low volume of ${qty} units — per-unit cost is higher due to limited scale efficiencies.`);
  if (form.rush === "Yes") rationale.push(`A 25% rush premium has been applied to account for expedited production scheduling and priority handling.`);
  if (conf === "LOW") rationale.push(`Warning: Low confidence — fewer than 2 comparable quotes found. Manual review strongly recommended.`);
  else if (conf === "MEDIUM") rationale.push(`Moderate confidence — 2 to 4 comparable quotes found. Price is directionally sound but review advised.`);
  else rationale.push(`High confidence — ${priced.length} comparable quotes provide a strong data foundation for this recommendation.`);
  if (parseFloat((base * rush * qty).toFixed(2)) > 5000) rationale.push(`Total exceeds $5,000 threshold — owner approval is required per company policy.`);
  return { unitPrice: unit, low: (base * 0.90).toFixed(2), high: (base * 1.15).toFixed(2), total, confidence: conf, matchCount: priced.length, comparables: priced.slice(0, 3), escalate: parseFloat(total) > 5000 || form.rush === "Yes", rushApplied: form.rush === "Yes", rationale };
}

// ── SHARED STYLES ────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  input:focus, select:focus, textarea:focus {
    border-color: ${B.primary} !important;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.1) !important;
  }
  select option { background: ${B.card}; color: ${B.text}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.35); }
`;

const cardStyle = {
  background: B.card, border: `1px solid ${B.border}`,
  borderRadius: 10, padding: 24,
};

const inputStyle = {
  width: "100%", padding: "10px 14px", background: B.surface,
  border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 14,
  color: B.text, fontFamily: FONT_BODY, boxSizing: "border-box",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", color: B.mutedLight, marginBottom: 6, fontFamily: FONT_BODY }}>
        {label}{required && <span style={{ color: B.danger, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Badge({ label, color, glow }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
      padding: "3px 10px", background: `${color}12`, color, border: `1px solid ${color}30`,
      borderRadius: 6, fontFamily: FONT_MONO,
      boxShadow: glow ? `0 0 12px ${color}25` : "none",
    }}>{label}</span>
  );
}

const statusColor = (s) => s === "Approved" ? B.success : s === "Escalated" ? B.warning : s === "Rejected" ? B.danger : B.muted;

// ── AUDIT TRAIL PAGE ────────────────────────────────────────────────────
function AuditTrail() {
  const [trail, setTrail] = useState(getAuditTrail());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [partFilter, setPartFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortCol, setSortCol] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => { setTrail(getAuditTrail()); }, []);

  const statuses = useMemo(() => ["All", ...new Set(trail.map(r => r.status))], [trail]);
  const industries = useMemo(() => ["All", ...new Set(trail.map(r => r.industry))], [trail]);
  const parts = useMemo(() => ["All", ...new Set(trail.map(r => r.part))].sort(), [trail]);

  const filtered = useMemo(() => {
    let rows = [...trail];
    if (search) { const q = search.toLowerCase(); rows = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q))); }
    if (statusFilter !== "All") rows = rows.filter(r => r.status === statusFilter);
    if (industryFilter !== "All") rows = rows.filter(r => r.industry === industryFilter);
    if (confidenceFilter !== "All") rows = rows.filter(r => r.confidence === confidenceFilter);
    if (partFilter !== "All") rows = rows.filter(r => r.part === partFilter);
    if (dateFrom) rows = rows.filter(r => r.timestamp.slice(0, 10) >= dateFrom);
    if (dateTo) rows = rows.filter(r => r.timestamp.slice(0, 10) <= dateTo);
    rows.sort((a, b) => {
      let aV = a[sortCol] || "", bV = b[sortCol] || "";
      if (["unitPrice","finalPrice","total","quantity"].includes(sortCol)) { aV = parseFloat(aV) || 0; bV = parseFloat(bV) || 0; }
      else { aV = String(aV).toLowerCase(); bV = String(bV).toLowerCase(); }
      return aV < bV ? (sortDir === "asc" ? -1 : 1) : aV > bV ? (sortDir === "asc" ? 1 : -1) : 0;
    });
    return rows;
  }, [trail, search, statusFilter, industryFilter, confidenceFilter, partFilter, dateFrom, dateTo, sortCol, sortDir]);

  const handleSort = (col) => { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("asc"); } };
  const sortArrow = (col) => sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const fInp = { ...inputStyle, padding: "8px 12px", fontSize: 13 };

  const thStyle = {
    padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 600,
    letterSpacing: 0.8, textTransform: "uppercase", color: B.primary400,
    cursor: "pointer", borderBottom: `1px solid ${B.border}`, whiteSpace: "nowrap",
    userSelect: "none", fontFamily: FONT_MONO,
  };
  const tdStyle = {
    padding: "12px 14px", fontSize: 13, color: B.text,
    borderBottom: `1px solid rgba(56,189,248,0.06)`, whiteSpace: "nowrap",
    fontFamily: FONT_BODY,
  };

  const totalQuotes = trail.length;
  const approvedCount = trail.filter(r => r.status === "Approved").length;
  const escalatedCount = trail.filter(r => r.status === "Escalated").length;
  const totalRevenue = trail.filter(r => r.status === "Approved").reduce((s, r) => s + (parseFloat(r.total) || 0), 0);

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          ["Total Quotes", totalQuotes, B.primary],
          ["Approved", approvedCount, B.success],
          ["Escalated", escalatedCount, B.warning],
          ["Revenue", `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, B.teal],
        ].map(([label, value, color]) => (
          <div key={label} style={{ ...cardStyle, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.8, textTransform: "uppercase", color: B.muted, marginBottom: 8, fontFamily: FONT_MONO }}>{label}</div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, marginBottom: 20, padding: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: B.muted, marginBottom: 4, fontFamily: FONT_MONO }}>Search</label>
            <input style={{ ...fInp, width: "100%" }} placeholder="Search quotes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {[
            ["Status", statusFilter, setStatusFilter, statuses],
            ["Industry", industryFilter, setIndustryFilter, industries],
            ["Part Name", partFilter, setPartFilter, parts],
            ["Confidence", confidenceFilter, setConfidenceFilter, ["All","HIGH","MEDIUM","LOW"]],
          ].map(([label, val, setter, opts]) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: B.muted, marginBottom: 4, fontFamily: FONT_MONO }}>{label}</label>
              <select style={fInp} value={val} onChange={e => setter(e.target.value)}>{opts.map(s => <option key={s}>{s}</option>)}</select>
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: B.muted, marginBottom: 4, fontFamily: FONT_MONO }}>From</label>
            <input type="date" style={{ ...fInp, colorScheme: "dark" }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: B.muted, marginBottom: 4, fontFamily: FONT_MONO }}>To</label>
            <input type="date" style={{ ...fInp, colorScheme: "dark" }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <button onClick={() => exportToCSV(filtered)} style={{
            padding: "8px 16px", background: `linear-gradient(135deg, ${B.primary600}, ${B.primary})`,
            color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600,
            letterSpacing: 0.8, textTransform: "uppercase", cursor: "pointer", fontFamily: FONT_MONO,
          }}>Export CSV</button>
          <button onClick={() => { setSearch(""); setStatusFilter("All"); setIndustryFilter("All"); setConfidenceFilter("All"); setPartFilter("All"); setDateFrom(""); setDateTo(""); }} style={{
            padding: "8px 14px", background: "transparent", color: B.muted,
            border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 11, fontWeight: 500,
            letterSpacing: 0.8, textTransform: "uppercase", cursor: "pointer", fontFamily: FONT_MONO,
          }}>Clear</button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: B.muted, marginBottom: 10, fontFamily: FONT_MONO }}>
        {filtered.length} of {trail.length} records
      </div>

      {/* Table */}
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1300 }}>
            <thead>
              <tr style={{ background: "rgba(56,189,248,0.04)" }}>
                {[["timestamp","Date"],["customer","Customer"],["part","Part"],["material","Material"],["quantity","Qty"],["unitPrice","Rec. Price"],["finalPrice","Final Price"],["confidence","Confidence"],["status","Status"],["approvedBy","Approved By"]].map(([col, label]) => (
                  <th key={col} style={thStyle} onClick={() => handleSort(col)}>{label}{sortArrow(col)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: "center", padding: 48, color: B.muted }}>{trail.length === 0 ? "No quotes yet." : "No records match your filters."}</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.requestId + i} onClick={() => setSelectedRow(selectedRow === i ? null : i)}
                  style={{ cursor: "pointer", background: selectedRow === i ? "rgba(56,189,248,0.06)" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (selectedRow !== i) e.currentTarget.style.background = "rgba(56,189,248,0.03)"; }}
                  onMouseLeave={e => { if (selectedRow !== i) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={tdStyle}>{new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{r.customer}</td>
                  <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>{r.part}</td>
                  <td style={tdStyle}>{r.material}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO }}>{r.quantity}</td>
                  <td style={{ ...tdStyle, textAlign: "right", color: B.primary400, fontWeight: 600, fontFamily: FONT_MONO }}>${r.unitPrice}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, fontFamily: FONT_MONO, color: r.finalPrice ? (r.finalPrice !== r.unitPrice ? B.accent : B.success) : B.muted }}>{r.finalPrice ? `$${r.finalPrice}` : "—"}</td>
                  <td style={tdStyle}><Badge label={r.confidence} color={r.confidence === "HIGH" ? B.success : r.confidence === "MEDIUM" ? B.warning : B.danger} /></td>
                  <td style={tdStyle}><Badge label={r.status} color={statusColor(r.status)} /></td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{r.approvedBy || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Detail */}
      {selectedRow !== null && filtered[selectedRow] && (() => { const r = filtered[selectedRow]; return (
        <div style={{ ...cardStyle, marginTop: 14, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${statusColor(r.status)}, ${B.primary}, transparent)` }} />
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.primary, textTransform: "uppercase", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>
            Quote Detail — {r.requestId}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[["Request ID", r.requestId],["Timestamp", new Date(r.timestamp).toLocaleString()],["Status", r.status],["Submitted By", r.submittedBy],["Customer", r.customer],["Email", r.customerEmail],["Industry", r.industry],["Part", r.part],["Material", r.material],["Size", r.size],["Quantity", r.quantity],["Finish", r.finish],["Marking", r.marking],["Rush", r.rush],["Recommended Price", `$${r.unitPrice}`],["Final Price", r.finalPrice ? `$${r.finalPrice}` : "—"],["Price Range", r.priceRange],["Total", `$${r.total}`],["Confidence", r.confidence],["Approved By", r.approvedBy || "—"],["Notes", r.notes || "—"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderBottom: `1px solid rgba(56,189,248,0.06)` }}>
                <span style={{ fontSize: 12, color: B.muted, fontFamily: FONT_BODY }}>{k}</span>
                <span style={{ fontSize: 12, color: B.text, fontWeight: 500, textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT_MONO }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      ); })()}
    </div>
  );
}

// ── OWNER APPROVAL ──────────────────────────────────────────────────────
function OwnerApproval({ data }) {
  const [modifiedPrice, setModifiedPrice] = useState(data.unitPrice || "");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const modifiedTotal = (parseFloat(modifiedPrice || 0) * parseInt(data.quantity || 1)).toFixed(2);
  const priceChanged = parseFloat(modifiedPrice) !== parseFloat(data.unitPrice);

  const handleApprove = async () => {
    setSending(true);
    try {
      await fetch("https://cloud.activepieces.com/api/v1/webhooks/VCabSdPLabpnL8aUnebLz", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approved", requestId: data.requestId, submittedBy: data.submittedBy, customer: data.customer, customerEmail: data.customerEmail, industry: data.industry, part: data.part, material: data.material, size: data.size, quantity: data.quantity, finish: data.finish, marking: data.marking, rush: data.rush, notes: data.notes || "", unitPrice: modifiedPrice, priceRange: data.priceRange, total: modifiedTotal, confidence: data.confidence, matchCount: data.matchCount, escalate: false, aiAnalysis: "", ownerApproved: true, ownerModifiedPrice: priceChanged, approvedBy: "Owner", timestamp: new Date().toISOString() }),
      });
      saveAuditEntry({ requestId: data.requestId, timestamp: new Date().toISOString(), status: "Approved", submittedBy: data.submittedBy, customer: data.customer, customerEmail: data.customerEmail, industry: data.industry, part: data.part, material: data.material, size: data.size, quantity: data.quantity, finish: data.finish, marking: data.marking, rush: data.rush, notes: data.notes || "", unitPrice: data.unitPrice, finalPrice: modifiedPrice, priceRange: data.priceRange, total: modifiedTotal, confidence: data.confidence, approvedBy: "Owner" + (priceChanged ? ` (modified from $${data.unitPrice})` : "") });
      setDone(true);
    } catch (err) { alert("Failed to send approval."); }
    setSending(false);
  };

  if (done) return (
    <div style={{ background: B.bg, minHeight: "100vh", fontFamily: FONT_BODY, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ textAlign: "center", animation: "fadeUp 0.35s ease", maxWidth: 460 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${B.success}12`, border: `2px solid ${B.success}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>✓</div>
        <div style={{ fontFamily: FONT_HEADING, fontSize: 26, fontWeight: 800, color: B.textBright, marginBottom: 10 }}>Quote Approved</div>
        <div style={{ color: B.mutedLight, fontSize: 14, lineHeight: 1.7 }}>
          {priceChanged ? `Price updated to $${modifiedPrice}/unit ($${modifiedTotal} total).` : `Approved at $${modifiedPrice}/unit ($${modifiedTotal} total).`} Confirmation email will be sent to {data.customer}.
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: B.bg, minHeight: "100vh", fontFamily: FONT_BODY, position: "relative" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ borderBottom: `1px solid ${B.border}`, background: B.surface, padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: `linear-gradient(135deg, ${B.primary600}, ${B.primary})`, color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: "5px 12px", borderRadius: 6 }}>CUEGENT</div>
          <div>
            <div style={{ color: B.textBright, fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700 }}>Pricing Engine</div>
            <div style={{ color: B.muted, fontSize: 11, letterSpacing: 1, marginTop: 1, fontFamily: FONT_MONO }}>OWNER APPROVAL</div>
          </div>
        </div>
        <Badge label="ESCALATED" color={B.warning} glow />
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px", animation: "fadeUp 0.35s ease" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 800, color: B.textBright }}>Quote Requires Your Approval</div>
          <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>Review the AI-recommended pricing below.</div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.primary400, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>Quote Details — {data.requestId}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[["Customer", data.customer],["Email", data.customerEmail],["Industry", data.industry],["Part", data.part],["Material", data.material],["Size", data.size],["Quantity", data.quantity + " units"],["Finish", data.finish],["Marking", data.marking],["Rush", data.rush]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 6px", borderBottom: `1px solid rgba(56,189,248,0.06)` }}>
                <span style={{ fontSize: 13, color: B.muted }}>{k}</span>
                <span style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 14, borderColor: `${B.success}30` }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.teal, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${B.success}20`, fontFamily: FONT_MONO }}>AI Recommendation</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, fontFamily: FONT_MONO }}>Unit Price</div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 30, fontWeight: 800, color: B.primary }}>${data.unitPrice}</div>
            </div>
            <div>
              <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, fontFamily: FONT_MONO }}>Total</div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 800, color: B.textBright }}>${data.total}</div>
            </div>
            <div>
              <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, fontFamily: FONT_MONO }}>Confidence</div>
              <Badge label={data.confidence} color={data.confidence === "HIGH" ? B.success : data.confidence === "MEDIUM" ? B.warning : B.danger} glow />
            </div>
          </div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 24, borderColor: B.borderHi }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.primary400, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>Your Decision</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: B.muted, marginBottom: 6, fontFamily: FONT_MONO }}>Unit Price ($)</label>
              <input type="number" step="0.01" value={modifiedPrice} onChange={e => setModifiedPrice(e.target.value)} style={{ ...inputStyle, padding: "14px 16px", fontSize: 22, fontWeight: 700, fontFamily: FONT_HEADING, borderColor: priceChanged ? B.warning : B.border, borderWidth: 2 }} />
            </div>
            <div style={{ textAlign: "center", paddingBottom: 4 }}>
              <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, fontFamily: FONT_MONO }}>New Total</div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 800, color: priceChanged ? B.warning : B.textBright }}>${modifiedTotal}</div>
            </div>
          </div>
          {priceChanged && <div style={{ marginTop: 12, padding: "8px 12px", background: `${B.warning}08`, border: `1px solid ${B.warning}25`, borderRadius: 6, fontSize: 12, color: B.warning }}>Price modified from ${data.unitPrice} to ${modifiedPrice} per unit</div>}
        </div>
        <button onClick={handleApprove} disabled={sending || !modifiedPrice} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, #059669, ${B.success})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: FONT_MONO, opacity: sending ? 0.6 : 1 }}>
          {sending ? "Approving..." : priceChanged ? `Approve at $${modifiedPrice}` : "Approve Quote"}
        </button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────
export default function App() {
  const today = new Date().toISOString().split("T")[0];
  const requestId = "QR-" + Date.now().toString(36).toUpperCase();
  const [approvalData, setApprovalData] = useState(null);
  const [page, setPage] = useState("quote");
  const [form, setForm] = useState({ requestId, submittedBy: "Maria Santos", submittedDate: today, status: "Pending", customer: "", customerEmail: "", industry: "Aerospace", part: "Data Plate - Engine Serial", material: "Aluminum", length: "", width: "", thickness: "0.063", quantity: "", finish: "Anodized Black", marking: "Laser Engraved", rush: "No", notes: "" });
  const [step, setStep] = useState("form");
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState("");

  useEffect(() => { const p = new URLSearchParams(window.location.search).get("approve"); if (p) { try { setApprovalData(JSON.parse(atob(p))); } catch {} } }, []);
  if (approvalData) return <OwnerApproval data={approvalData} />;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.customer || !form.customerEmail || !form.length || !form.width || !form.quantity) { setError("Please fill in all required fields."); return; }
    setError(""); setStep("calculating");
    const p = calculatePrice(form); setPricing(p);
    setTimeout(() => setStep("result"), 600);
  };
  const buildAuditEntry = (action) => ({ requestId: form.requestId, timestamp: new Date().toISOString(), status: action === "approved" ? "Approved" : action === "escalated" ? "Escalated" : "Rejected", submittedBy: form.submittedBy, customer: form.customer, customerEmail: form.customerEmail, industry: form.industry, part: form.part, material: form.material, size: `${form.length} x ${form.width} x ${form.thickness} in`, quantity: form.quantity, finish: form.finish, marking: form.marking, rush: form.rush, notes: form.notes, unitPrice: pricing?.unitPrice || "", finalPrice: action === "approved" ? (pricing?.unitPrice || "") : "", priceRange: pricing ? `${pricing.low} - ${pricing.high}` : "", total: pricing?.total || "", confidence: pricing?.confidence || "", approvedBy: action === "approved" ? form.submittedBy : "" });

  const sendToWebhook = async (action) => {
    setSending(action);
    const url = action === "escalated" ? "https://cloud.activepieces.com/api/v1/webhooks/slPOyPlR2N2vbG0Pf11JI" : "https://cloud.activepieces.com/api/v1/webhooks/VCabSdPLabpnL8aUnebLz";
    try {
      await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, requestId: form.requestId, submittedBy: form.submittedBy, customer: form.customer, customerEmail: form.customerEmail, industry: form.industry, part: form.part, material: form.material, size: `${form.length} x ${form.width} x ${form.thickness} in`, quantity: form.quantity, finish: form.finish, marking: form.marking, rush: form.rush, notes: form.notes, unitPrice: pricing.unitPrice, priceRange: `${pricing.low} - ${pricing.high}`, total: pricing.total, confidence: pricing.confidence, matchCount: pricing.matchCount, escalate: pricing.escalate, aiAnalysis: "", approvedBy: action === "approved" ? form.submittedBy : "", timestamp: new Date().toISOString() }) });
      saveAuditEntry(buildAuditEntry(action));
      setSending(""); alert(action === "approved" ? "Quote approved and sent!" : "Quote escalated to owner!");
    } catch { setSending(""); alert("Failed to send."); }
  };
  const handleReject = () => { saveAuditEntry(buildAuditEntry("rejected")); alert("Quote rejected."); reset(); };
  const reset = () => { setStep("form"); setPricing(null); setForm(f => ({ ...f, customer: "", customerEmail: "", length: "", width: "", quantity: "", notes: "", requestId: "QR-" + Date.now().toString(36).toUpperCase() })); };

  const navBtn = (label, target) => (
    <button onClick={() => setPage(target)} style={{
      padding: "6px 16px", background: page === target ? `${B.primary}15` : "transparent",
      border: page === target ? `1px solid ${B.primary}40` : "1px solid transparent",
      borderRadius: 6, fontSize: 12, fontWeight: page === target ? 600 : 400,
      letterSpacing: 0.5, cursor: "pointer", fontFamily: FONT_MONO,
      color: page === target ? B.primary : B.muted, transition: "all 0.2s",
    }}>{label}</button>
  );

  return (
    <div style={{ background: B.bg, minHeight: "100vh", fontFamily: FONT_BODY, position: "relative" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${B.border}`, background: B.surface, padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: `linear-gradient(135deg, ${B.primary600}, ${B.primary})`, color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: "5px 12px", borderRadius: 6 }}>CUEGENT</div>
          <div>
            <div style={{ color: B.textBright, fontFamily: FONT_HEADING, fontSize: 15, fontWeight: 700 }}>Pricing Engine</div>
            <div style={{ color: B.muted, fontSize: 11, letterSpacing: 1, marginTop: 1, fontFamily: FONT_MONO }}>AI-POWERED QUOTING</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {navBtn("New Quote", "quote")}
          {navBtn("Audit Trail", "audit")}
          <div style={{ width: 1, height: 18, background: B.border, margin: "0 6px" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.success, boxShadow: `0 0 8px ${B.success}60` }} />
          <span style={{ color: B.muted, fontSize: 11, letterSpacing: 1, fontFamily: FONT_MONO }}>LIVE</span>
        </div>
      </div>

      <div style={{ maxWidth: page === "audit" ? 1200 : 920, margin: "0 auto", padding: "32px 24px", transition: "max-width 0.3s" }}>

        {/* AUDIT */}
        {page === "audit" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 800, color: B.textBright, letterSpacing: -0.3 }}>Audit Trail</div>
              <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>Complete history of all quotation actions — search, filter, and export for auditing.</div>
            </div>
            <AuditTrail />
          </div>
        )}

        {/* QUOTE */}
        {page === "quote" && (
          <>
            {step === "form" && (
              <div style={{ animation: "fadeUp 0.35s ease" }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 800, color: B.textBright, letterSpacing: -0.3 }}>New Quote Request</div>
                  <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>Fill in the details below — AI will recommend a competitive price based on historical data.</div>
                </div>
                {error && <div style={{ background: `${B.danger}08`, border: `1px solid ${B.danger}25`, borderLeft: `3px solid ${B.danger}`, borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 14, color: B.danger }}>{error}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.primary400, textTransform: "uppercase", marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>Customer Details</div>
                    <Field label="Submitted By"><input style={inputStyle} value={form.submittedBy} onChange={e => set("submittedBy", e.target.value)} /></Field>
                    <Field label="Customer Name" required><input style={inputStyle} placeholder="e.g. Bell Helicopter" value={form.customer} onChange={e => set("customer", e.target.value)} /></Field>
                    <Field label="Customer Email" required><input style={inputStyle} type="email" placeholder="e.g. procurement@bellhelicopter.com" value={form.customerEmail} onChange={e => set("customerEmail", e.target.value)} /></Field>
                    <Field label="Industry" required><select style={inputStyle} value={form.industry} onChange={e => set("industry", e.target.value)}>{["Aerospace","Automotive","Defense","Medical","Industrial"].map(o => <option key={o}>{o}</option>)}</select></Field>
                    <Field label="Part Name" required><select style={inputStyle} value={form.part} onChange={e => set("part", e.target.value)}>{["Data Plate - Engine Serial","VIN Plate - Cab Door","Equipment ID Plate","Warning Label","Device Serial Plate","Wiring Harness Tag","Equipment Nameplate","Airframe Plate","Cab Interior Plate","Surgical Instrument Tag","Interior Panel Placard","Axle Rating Plate","Implant ID Tag","Landing Gear Plate","Bumper ID Plate","Electronics Panel ID","Helicopter Interior Tag","Rotor Blade Tag","Vehicle ID Plate","Diagnostic Equipment Tag"].map(o => <option key={o}>{o}</option>)}</select></Field>
                    <Field label="Special Requirements"><textarea style={{ ...inputStyle, height: 66, resize: "none" }} placeholder="e.g. AS9100 required, ITAR controlled..." value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.primary400, textTransform: "uppercase", marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>Part Specifications</div>
                    <Field label="Material" required><select style={inputStyle} value={form.material} onChange={e => set("material", e.target.value)}>{["Aluminum","Stainless Steel","Titanium","Polyester","Brass"].map(o => <option key={o}>{o}</option>)}</select></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <Field label="Length (in)" required><input style={inputStyle} type="number" placeholder="4" value={form.length} onChange={e => set("length", e.target.value)} /></Field>
                      <Field label="Width (in)" required><input style={inputStyle} type="number" placeholder="2" value={form.width} onChange={e => set("width", e.target.value)} /></Field>
                      <Field label="Thickness (in)"><input style={inputStyle} type="number" placeholder="0.063" value={form.thickness} onChange={e => set("thickness", e.target.value)} /></Field>
                    </div>
                    <Field label="Quantity" required><input style={inputStyle} type="number" placeholder="75" value={form.quantity} onChange={e => set("quantity", e.target.value)} /></Field>
                    <Field label="Finish"><select style={inputStyle} value={form.finish} onChange={e => set("finish", e.target.value)}>{["Anodized Black","Anodized","Brushed","Electropolished","Paint","Alodine","Passivated","None"].map(o => <option key={o}>{o}</option>)}</select></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <Field label="Marking Type"><select style={inputStyle} value={form.marking} onChange={e => set("marking", e.target.value)}>{["Laser Engraved","Chemical Etch","Embossed","Silkscreen","Digital Print"].map(o => <option key={o}>{o}</option>)}</select></Field>
                      <Field label="Rush Order"><select style={inputStyle} value={form.rush} onChange={e => set("rush", e.target.value)}><option>No</option><option>Yes</option></select></Field>
                    </div>
                  </div>
                </div>
                <button onClick={submit} style={{ width: "100%", marginTop: 18, padding: "14px", background: `linear-gradient(135deg, ${B.primary600}, ${B.primary})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: FONT_MONO }}>Generate AI Price Recommendation</button>
              </div>
            )}

            {step === "calculating" && (
              <div style={{ textAlign: "center", padding: "100px 0", animation: "fadeUp 0.35s ease" }}>
                <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 24px" }}>
                  <div style={{ position: "absolute", inset: 0, border: `2px solid ${B.border}`, borderRadius: "50%" }} />
                  <div style={{ position: "absolute", inset: 0, border: "2px solid transparent", borderTopColor: B.primary, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
                  <div style={{ position: "absolute", inset: 10, border: "1px solid transparent", borderTopColor: B.teal, borderRadius: "50%", animation: "spin 0.6s linear infinite reverse" }} />
                </div>
                <div style={{ fontFamily: FONT_HEADING, fontSize: 20, color: B.textBright, fontWeight: 700, marginBottom: 8 }}>Analyzing Historical Data</div>
                <div style={{ color: B.muted, fontSize: 13, animation: "pulse 1.5s ease infinite", fontFamily: FONT_MONO }}>Cuegent AI is generating your pricing recommendation...</div>
              </div>
            )}

            {step === "result" && pricing && (
              <div style={{ animation: "fadeUp 0.35s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 800, color: B.textBright }}>Quote Recommendation</div>
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>{form.customer} — {form.industry} — {form.part}</div>
                  </div>
                  <button onClick={reset} style={{ padding: "7px 16px", background: "transparent", border: `1px solid ${B.border}`, borderRadius: 6, fontSize: 12, cursor: "pointer", color: B.muted, fontFamily: FONT_MONO }}>New Quote</button>
                </div>

                {/* Price strip */}
                <div style={{ background: B.card, border: `1px solid ${B.borderHi}`, borderRadius: 10, padding: "26px 32px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6, fontFamily: FONT_MONO }}>Recommended Unit Price</div>
                    <div style={{ color: B.primary, fontFamily: FONT_HEADING, fontSize: 48, fontWeight: 800, lineHeight: 1 }}>${pricing.unitPrice}</div>
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 6, fontFamily: FONT_MONO }}>Range: ${pricing.low} — ${pricing.high}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6, fontFamily: FONT_MONO }}>Total Estimate</div>
                    <div style={{ color: B.textBright, fontFamily: FONT_HEADING, fontSize: 34, fontWeight: 800 }}>${pricing.total}</div>
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 4, fontFamily: FONT_MONO }}>for {form.quantity} units</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, fontFamily: FONT_MONO }}>Confidence</div>
                    <Badge label={pricing.confidence} color={pricing.confidence === "HIGH" ? B.success : pricing.confidence === "MEDIUM" ? B.warning : B.danger} glow />
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 8, fontFamily: FONT_MONO }}>{pricing.matchCount} matches</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: B.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, fontFamily: FONT_MONO }}>Owner Approval</div>
                    <Badge label={pricing.escalate ? "REQUIRED" : "NOT NEEDED"} color={pricing.escalate ? B.danger : B.success} glow />
                    {pricing.rushApplied && <div style={{ color: B.accent, fontSize: 12, marginTop: 8, fontFamily: FONT_MONO, fontWeight: 600 }}>+25% RUSH</div>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.teal, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>Comparable Quotes</div>
                    {pricing.comparables.length === 0 ? <div style={{ color: B.muted, fontSize: 12 }}>No direct comparables found.</div> : pricing.comparables.map((q, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 6px", borderBottom: `1px solid rgba(56,189,248,0.06)` }}>
                        <div>
                          <div style={{ fontSize: 14, color: B.text, fontWeight: 600 }}>{q.customer}</div>
                          <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>{q.material} — {q.size_length_in}x{q.size_width_in}in — qty {q.quantity}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: B.primary, fontFamily: FONT_MONO }}>${q.unit_price_usd}</div>
                      </div>
                    ))}
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.teal, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>Request Summary</div>
                    {[["Submitted By", form.submittedBy],["Customer", form.customer],["Email", form.customerEmail],["Industry", form.industry],["Part Name", form.part],["Material", form.material],["Size", `${form.length} x ${form.width} x ${form.thickness} in`],["Quantity", form.quantity],["Finish", form.finish],["Marking", form.marking],["Rush Order", form.rush]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid rgba(56,189,248,0.06)` }}>
                        <span style={{ fontSize: 13, color: B.muted }}>{k}</span>
                        <span style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Rationale */}
                {pricing.rationale?.length > 0 && (
                  <div style={{ ...cardStyle, marginBottom: 14, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.primary}, ${B.teal}, transparent)` }} />
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: B.primary, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${B.border}`, fontFamily: FONT_MONO }}>
                      AI Pricing Rationale
                    </div>
                    {pricing.rationale.map((line, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < pricing.rationale.length - 1 ? 10 : 0 }}>
                        <span style={{ color: B.primary400, fontSize: 8, marginTop: 6, flexShrink: 0 }}>●</span>
                        <p style={{ margin: 0, fontSize: 13, color: B.mutedLight, lineHeight: 1.65 }}>{line}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => sendToWebhook("approved")} disabled={!!sending} style={{ flex: 1, padding: "13px", background: `linear-gradient(135deg, #059669, ${B.success})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: FONT_MONO, opacity: sending ? 0.6 : 1 }}>{sending === "approved" ? "Sending..." : "Approve & Send"}</button>
                  <button onClick={() => sendToWebhook("escalated")} disabled={!!sending} style={{ flex: 1, padding: "13px", background: `linear-gradient(135deg, ${B.primary600}, ${B.primary})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: FONT_MONO, opacity: sending ? 0.6 : 1 }}>{sending === "escalated" ? "Sending..." : "Escalate to Owner"}</button>
                  <button onClick={handleReject} style={{ padding: "13px 20px", background: "transparent", color: B.muted, border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, letterSpacing: 0.8, textTransform: "uppercase", cursor: "pointer", fontFamily: FONT_MONO }}>Reject</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
