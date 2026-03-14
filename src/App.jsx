import { useState, useEffect, useMemo } from "react";

// ── BRAND TOKENS ──────────────────────────────────────────────────────────
const B = {
  bg:        "#030014",
  surface:   "#120a2e",
  glass:     "rgba(255,255,255,0.05)",
  border:    "rgba(139,92,246,0.45)",
  primary:   "#8b5cf6",
  primary600:"#7c3aed",
  primary400:"#a78bfa",
  primary200:"#ddd6fe",
  pink:      "#f472b6",
  cyan:      "#22d3ee",
  text:      "#f1f5f9",
  muted:     "#94a3b8",
  success:   "#4ade80",
  danger:    "#f87171",
  warning:   "#fbbf24",
};

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
  { requestId:"QR-S001", timestamp:"2026-03-14T09:12:33.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Bell Helicopter", customerEmail:"procurement@bellhelicopter.com", industry:"Aerospace", part:"Data Plate - Engine Serial", material:"Aluminum", size:"4 x 2 x 0.063 in", quantity:"75", finish:"Anodized Black", marking:"Laser Engraved", rush:"No", notes:"", unitPrice:"17.17", priceRange:"15.46 - 19.75", total:"1287.75", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S002", timestamp:"2026-03-13T14:45:10.000Z", status:"Escalated", submittedBy:"James Rivera", customer:"Lockheed Martin", customerEmail:"quotes@lockheedmartin.com", industry:"Defense", part:"Airframe Plate", material:"Aluminum", size:"10 x 6 x 0.08 in", quantity:"20", finish:"Alodine", marking:"Chemical Etch", rush:"Yes", notes:"ITAR controlled", unitPrice:"97.50", priceRange:"87.75 - 112.13", total:"1950.00", confidence:"MEDIUM", approvedBy:"" },
  { requestId:"QR-S003", timestamp:"2026-03-13T11:22:05.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Boeing", customerEmail:"sourcing@boeing.com", industry:"Aerospace", part:"Landing Gear Plate", material:"Stainless Steel", size:"5 x 3 x 0.05 in", quantity:"45", finish:"Passivated", marking:"Laser Engraved", rush:"No", notes:"AS9100 required", unitPrice:"38.00", priceRange:"34.20 - 43.70", total:"1710.00", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S004", timestamp:"2026-03-12T16:08:41.000Z", status:"Rejected", submittedBy:"Carlos Vega", customer:"Tesla Motors", customerEmail:"procurement@tesla.com", industry:"Automotive", part:"VIN Plate - Cab Door", material:"Aluminum", size:"3 x 2 x 0.04 in", quantity:"1000", finish:"Anodized", marking:"Laser Engraved", rush:"No", notes:"Customer requested lower price", unitPrice:"7.83", priceRange:"7.05 - 9.01", total:"7830.00", confidence:"MEDIUM", approvedBy:"" },
  { requestId:"QR-S005", timestamp:"2026-03-12T10:33:18.000Z", status:"Approved", submittedBy:"James Rivera", customer:"Medtronic", customerEmail:"vendor@medtronic.com", industry:"Medical", part:"Surgical Instrument Tag", material:"Stainless Steel", size:"1.5 x 0.5 x 0.03 in", quantity:"200", finish:"Electropolished", marking:"Laser Engraved", rush:"No", notes:"FDA UDI compliant", unitPrice:"18.50", priceRange:"16.65 - 21.28", total:"3700.00", confidence:"HIGH", approvedBy:"James Rivera" },
  { requestId:"QR-S006", timestamp:"2026-03-11T08:55:02.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Caterpillar", customerEmail:"purchasing@cat.com", industry:"Automotive", part:"Equipment Nameplate", material:"Aluminum", size:"5 x 3 x 0.063 in", quantity:"250", finish:"Anodized Black", marking:"Embossed", rush:"No", notes:"", unitPrice:"9.20", priceRange:"8.28 - 10.58", total:"2300.00", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S007", timestamp:"2026-03-11T13:20:55.000Z", status:"Escalated", submittedBy:"Carlos Vega", customer:"Northrop Grumman", customerEmail:"contracts@northropgrumman.com", industry:"Defense", part:"Electronics Panel ID", material:"Stainless Steel", size:"8 x 4 x 0.05 in", quantity:"30", finish:"Passivated", marking:"Chemical Etch", rush:"Yes", notes:"ITAR controlled, classified project", unitPrice:"52.50", priceRange:"47.25 - 60.38", total:"1575.00", confidence:"MEDIUM", approvedBy:"" },
  { requestId:"QR-S008", timestamp:"2026-03-10T15:42:30.000Z", status:"Approved", submittedBy:"James Rivera", customer:"Stryker", customerEmail:"procurement@stryker.com", industry:"Medical", part:"Implant ID Tag", material:"Titanium", size:"1.5 x 0.75 x 0.02 in", quantity:"100", finish:"Electropolished", marking:"Laser Engraved", rush:"No", notes:"ISO 13485, biocompatible", unitPrice:"38.00", priceRange:"34.20 - 43.70", total:"3800.00", confidence:"HIGH", approvedBy:"James Rivera" },
  { requestId:"QR-S009", timestamp:"2026-03-10T09:15:44.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Airbus", customerEmail:"supply.chain@airbus.com", industry:"Aerospace", part:"Interior Panel Placard", material:"Aluminum", size:"6 x 3 x 0.04 in", quantity:"150", finish:"Anodized", marking:"Silkscreen", rush:"No", notes:"", unitPrice:"19.50", priceRange:"17.55 - 22.43", total:"2925.00", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S010", timestamp:"2026-03-09T11:30:12.000Z", status:"Rejected", submittedBy:"Carlos Vega", customer:"General Dynamics", customerEmail:"quotes@gd.com", industry:"Defense", part:"Warning Label", material:"Polyester", size:"4 x 2 x 0.01 in", quantity:"500", finish:"None", marking:"Digital Print", rush:"No", notes:"Budget constraints", unitPrice:"3.20", priceRange:"2.88 - 3.68", total:"1600.00", confidence:"LOW", approvedBy:"" },
  { requestId:"QR-S011", timestamp:"2026-03-08T14:05:28.000Z", status:"Approved", submittedBy:"Maria Santos", customer:"Peterbilt Motors", customerEmail:"purchasing@peterbilt.com", industry:"Automotive", part:"Bumper ID Plate", material:"Stainless Steel", size:"3 x 2 x 0.05 in", quantity:"300", finish:"Brushed", marking:"Embossed", rush:"No", notes:"", unitPrice:"8.75", priceRange:"7.88 - 10.06", total:"2625.00", confidence:"HIGH", approvedBy:"Maria Santos" },
  { requestId:"QR-S012", timestamp:"2026-03-07T10:48:33.000Z", status:"Approved", submittedBy:"James Rivera", customer:"Boston Scientific", customerEmail:"vendor.mgmt@bsci.com", industry:"Medical", part:"Device Serial Plate", material:"Titanium", size:"1.5 x 0.75 x 0.02 in", quantity:"75", finish:"Electropolished", marking:"Laser Engraved", rush:"Yes", notes:"Urgent production run", unitPrice:"47.50", priceRange:"34.20 - 43.70", total:"3562.50", confidence:"HIGH", approvedBy:"Owner" },
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
  const headers = ["Request ID","Timestamp","Status","Submitted By","Customer","Email","Industry","Part","Material","Size","Quantity","Finish","Marking","Rush","Unit Price","Total","Confidence","Approved By","Notes"];
  const rows = data.map(r => [
    r.requestId, r.timestamp, r.status, r.submittedBy, r.customer, r.customerEmail,
    r.industry, r.part, r.material, r.size, r.quantity, r.finish, r.marking, r.rush,
    r.unitPrice, r.total, r.confidence, r.approvedBy || "", r.notes || "",
  ].map(v => `"${String(v || "").replace(/"/g, '""')}"`));
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PR1SM_Audit_Trail_${new Date().toISOString().split("T")[0]}.csv`;
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

  // ── Build pricing rationale ──
  const avgPpsqin = avg.toFixed(2);
  const topComps = priced.slice(0, 3);
  const custList = [...new Set(topComps.map(q => q.customer))].join(", ");
  const rationale = [];

  rationale.push(
    `Recommended price of $${(base * rush).toFixed(2)}/unit is derived from ${priced.length} historical won quotes` +
    ` in ${form.industry} using ${form.material}, averaging $${avgPpsqin}/sq.in across a ${area} sq.in part area.`
  );

  if (priced.length > 0) {
    const prices = priced.map(q => parseFloat(q.unit_price_usd));
    const minP = Math.min(...prices).toFixed(2);
    const maxP = Math.max(...prices).toFixed(2);
    rationale.push(
      `Historical unit prices for comparable orders range from $${minP} to $${maxP}.` +
      (custList ? ` Key reference accounts: ${custList}.` : "")
    );
  }

  const qty = parseInt(form.quantity || 1);
  if (qty >= 200) rationale.push(`Volume of ${qty} units positions this as a mid-to-high volume order — pricing reflects economies of scale.`);
  else if (qty <= 30) rationale.push(`Low volume of ${qty} units — per-unit cost is higher due to limited scale efficiencies.`);

  if (form.rush === "Yes") rationale.push(`A 25% rush premium has been applied to account for expedited production scheduling and priority handling.`);

  if (conf === "LOW") rationale.push(`Warning: Low confidence — fewer than 2 comparable quotes found. Manual review strongly recommended before sending.`);
  else if (conf === "MEDIUM") rationale.push(`Moderate confidence — 2 to 4 comparable quotes found. Price is directionally sound but a quick review is advised.`);
  else rationale.push(`High confidence — ${priced.length} comparable quotes provide a strong data foundation for this recommendation.`);

  if (parseFloat((base * rush * qty).toFixed(2)) > 5000) rationale.push(`Total exceeds $5,000 threshold — owner approval is required per company policy.`);

  return {
    unitPrice: unit, low: (base * 0.90).toFixed(2), high: (base * 1.15).toFixed(2),
    total, confidence: conf, matchCount: priced.length,
    comparables: priced.slice(0, 3),
    escalate: parseFloat(total) > 5000 || form.rush === "Yes",
    rushApplied: form.rush === "Yes",
    rationale,
  };
}


// ── FIELD ─────────────────────────────────────────────────────────────────
function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: '#cbd5e1', marginBottom: 7, fontFamily: "'DM Mono', monospace" }}>
        {label}{required && <span style={{ color: B.pink, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Badge({ label, color, glow }) {
  return (
    <span style={{
      letterSpacing: 2, textTransform: "uppercase", padding: "4px 10px",
      background: `${color}18`, color, border: `1px solid ${color}40`,
      borderRadius: 20, fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 11,
      boxShadow: glow ? `0 0 10px ${color}40` : "none",
    }}>{label}</span>
  );
}

// ── AUDIT TRAIL PAGE ────────────────────────────────────────────────────
function AuditTrail({ onBack }) {
  const [trail, setTrail] = useState(getAuditTrail());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortCol, setSortCol] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedRow, setSelectedRow] = useState(null);

  // Refresh when component mounts
  useEffect(() => { setTrail(getAuditTrail()); }, []);

  const statuses = useMemo(() => ["All", ...new Set(trail.map(r => r.status))], [trail]);
  const industries = useMemo(() => ["All", ...new Set(trail.map(r => r.industry))], [trail]);

  const filtered = useMemo(() => {
    let rows = [...trail];

    // Search
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    }

    // Filters
    if (statusFilter !== "All") rows = rows.filter(r => r.status === statusFilter);
    if (industryFilter !== "All") rows = rows.filter(r => r.industry === industryFilter);
    if (confidenceFilter !== "All") rows = rows.filter(r => r.confidence === confidenceFilter);
    if (dateFrom) rows = rows.filter(r => r.timestamp >= dateFrom);
    if (dateTo) rows = rows.filter(r => r.timestamp <= dateTo + "T23:59:59");

    // Sort
    rows.sort((a, b) => {
      let aVal = a[sortCol] || "";
      let bVal = b[sortCol] || "";
      if (sortCol === "unitPrice" || sortCol === "total" || sortCol === "quantity") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [trail, search, statusFilter, industryFilter, confidenceFilter, dateFrom, dateTo, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const sortIcon = (col) => sortCol === col ? (sortDir === "asc" ? " ^" : " v") : "";

  const inp = {
    padding: "8px 12px", background: "#1a0f3d",
    border: '1px solid rgba(139,92,246,0.45)',
    borderRadius: 6, fontSize: 13, color: '#f1f5f9',
    fontFamily: "'DM Mono', monospace", boxSizing: "border-box", outline: "none",
  };

  const card = {
    background: '#16093a', border: '1px solid rgba(139,92,246,0.5)',
    borderRadius: 12, padding: 24, backdropFilter: "blur(12px)",
  };

  const statusColor = (s) => {
    if (s === "Approved") return B.success;
    if (s === "Escalated") return B.warning;
    if (s === "Rejected") return B.danger;
    return B.muted;
  };

  const thStyle = {
    padding: "10px 12px", textAlign: "left", fontSize: 11, letterSpacing: 2,
    textTransform: "uppercase", color: '#a78bfa', cursor: "pointer",
    borderBottom: '2px solid rgba(139,92,246,0.4)', whiteSpace: "nowrap",
    userSelect: "none",
  };

  const tdStyle = {
    padding: "10px 12px", fontSize: 13, color: B.text,
    borderBottom: '1px solid rgba(139,92,246,0.15)', whiteSpace: "nowrap",
  };

  // Stats
  const totalQuotes = trail.length;
  const approvedCount = trail.filter(r => r.status === "Approved").length;
  const escalatedCount = trail.filter(r => r.status === "Escalated").length;
  const totalRevenue = trail.filter(r => r.status === "Approved").reduce((s, r) => s + (parseFloat(r.total) || 0), 0);

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          ["Total Quotes", totalQuotes, B.primary],
          ["Approved", approvedCount, B.success],
          ["Escalated", escalatedCount, B.warning],
          ["Revenue", `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, B.cyan],
        ].map(([label, value, color]) => (
          <div key={label} style={{ ...card, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color }} />
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...card, marginBottom: 20, padding: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>Search</label>
            <input
              style={{ ...inp, width: "100%" }}
              placeholder="Search by customer, ID, material..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>Status</label>
            <select style={inp} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>Industry</label>
            <select style={inp} value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
              {industries.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>Confidence</label>
            <select style={inp} value={confidenceFilter} onChange={e => setConfidenceFilter(e.target.value)}>
              {["All","HIGH","MEDIUM","LOW"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>From</label>
            <input type="date" style={inp} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>To</label>
            <input type="date" style={inp} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <button
            onClick={() => exportToCSV(filtered)}
            style={{
              padding: "9px 18px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: 6, fontSize: 11,
              letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontWeight: 600,
              boxShadow: "0 0 12px rgba(139,92,246,0.4)",
            }}
          >EXPORT CSV</button>
          <button
            onClick={() => { setSearch(""); setStatusFilter("All"); setIndustryFilter("All"); setConfidenceFilter("All"); setDateFrom(""); setDateTo(""); }}
            style={{
              padding: "9px 14px", background: B.glass, color: B.muted,
              border: '1px solid rgba(139,92,246,0.45)', borderRadius: 6, fontSize: 11,
              letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
            }}
          >CLEAR</button>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: B.muted }}>
          Showing {filtered.length} of {trail.length} records
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
            <thead>
              <tr style={{ background: "rgba(139,92,246,0.08)" }}>
                <th style={thStyle} onClick={() => handleSort("requestId")}>ID{sortIcon("requestId")}</th>
                <th style={thStyle} onClick={() => handleSort("timestamp")}>Date{sortIcon("timestamp")}</th>
                <th style={thStyle} onClick={() => handleSort("status")}>Status{sortIcon("status")}</th>
                <th style={thStyle} onClick={() => handleSort("customer")}>Customer{sortIcon("customer")}</th>
                <th style={thStyle} onClick={() => handleSort("industry")}>Industry{sortIcon("industry")}</th>
                <th style={thStyle} onClick={() => handleSort("part")}>Part{sortIcon("part")}</th>
                <th style={thStyle} onClick={() => handleSort("material")}>Material{sortIcon("material")}</th>
                <th style={thStyle} onClick={() => handleSort("quantity")}>Qty{sortIcon("quantity")}</th>
                <th style={thStyle} onClick={() => handleSort("unitPrice")}>Unit Price{sortIcon("unitPrice")}</th>
                <th style={thStyle} onClick={() => handleSort("total")}>Total{sortIcon("total")}</th>
                <th style={thStyle} onClick={() => handleSort("confidence")}>Conf.{sortIcon("confidence")}</th>
                <th style={thStyle} onClick={() => handleSort("submittedBy")}>Rep{sortIcon("submittedBy")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ ...tdStyle, textAlign: "center", padding: 40, color: B.muted }}>
                    {trail.length === 0 ? "No quotes yet. Submit a quote to begin tracking." : "No records match your filters."}
                  </td>
                </tr>
              ) : filtered.map((r, i) => (
                <tr
                  key={r.requestId + i}
                  onClick={() => setSelectedRow(selectedRow === i ? null : i)}
                  style={{
                    cursor: "pointer",
                    background: selectedRow === i ? "rgba(139,92,246,0.12)" : i % 2 === 0 ? "transparent" : "rgba(139,92,246,0.03)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (selectedRow !== i) e.currentTarget.style.background = "rgba(139,92,246,0.08)"; }}
                  onMouseLeave={e => { if (selectedRow !== i) e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(139,92,246,0.03)"; }}
                >
                  <td style={{ ...tdStyle, color: B.primary400, fontWeight: 600 }}>{r.requestId}</td>
                  <td style={tdStyle}>{new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td style={tdStyle}><Badge label={r.status} color={statusColor(r.status)} /></td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{r.customer}</td>
                  <td style={tdStyle}>{r.industry}</td>
                  <td style={{ ...tdStyle, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>{r.part}</td>
                  <td style={tdStyle}>{r.material}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{r.quantity}</td>
                  <td style={{ ...tdStyle, textAlign: "right", color: B.primary400, fontWeight: 600 }}>${r.unitPrice}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>${parseFloat(r.total).toLocaleString()}</td>
                  <td style={tdStyle}>
                    <Badge
                      label={r.confidence}
                      color={r.confidence === "HIGH" ? B.success : r.confidence === "MEDIUM" ? B.warning : B.danger}
                    />
                  </td>
                  <td style={tdStyle}>{r.submittedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Row Detail */}
      {selectedRow !== null && filtered[selectedRow] && (
        <div style={{ ...card, marginTop: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${statusColor(filtered[selectedRow].status)}, ${B.primary})` }} />
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#a855f7', textTransform: "uppercase", marginBottom: 16, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>
            Quote Detail — {filtered[selectedRow].requestId}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              ["Request ID", filtered[selectedRow].requestId],
              ["Timestamp", new Date(filtered[selectedRow].timestamp).toLocaleString()],
              ["Status", filtered[selectedRow].status],
              ["Submitted By", filtered[selectedRow].submittedBy],
              ["Customer", filtered[selectedRow].customer],
              ["Email", filtered[selectedRow].customerEmail],
              ["Industry", filtered[selectedRow].industry],
              ["Part", filtered[selectedRow].part],
              ["Material", filtered[selectedRow].material],
              ["Size", filtered[selectedRow].size],
              ["Quantity", filtered[selectedRow].quantity],
              ["Finish", filtered[selectedRow].finish],
              ["Marking", filtered[selectedRow].marking],
              ["Rush", filtered[selectedRow].rush],
              ["Unit Price", `$${filtered[selectedRow].unitPrice}`],
              ["Price Range", filtered[selectedRow].priceRange],
              ["Total", `$${filtered[selectedRow].total}`],
              ["Confidence", filtered[selectedRow].confidence],
              ["Approved By", filtered[selectedRow].approvedBy || "—"],
              ["Notes", filtered[selectedRow].notes || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
                <span style={{ fontSize: 12, color: B.muted }}>{k}</span>
                <span style={{ fontSize: 12, color: B.text, fontWeight: 500, textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── OWNER APPROVAL PAGE ──────────────────────────────────────────────────
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approved",
          requestId: data.requestId,
          submittedBy: data.submittedBy,
          customer: data.customer,
          customerEmail: data.customerEmail,
          industry: data.industry,
          part: data.part,
          material: data.material,
          size: data.size,
          quantity: data.quantity,
          finish: data.finish,
          marking: data.marking,
          rush: data.rush,
          notes: data.notes || "",
          unitPrice: modifiedPrice,
          priceRange: data.priceRange,
          total: modifiedTotal,
          confidence: data.confidence,
          matchCount: data.matchCount,
          escalate: false,
          aiAnalysis: "",
          ownerApproved: true,
          ownerModifiedPrice: priceChanged,
          approvedBy: "Owner",
          timestamp: new Date().toISOString(),
        }),
      });
      // Log to audit trail
      saveAuditEntry({
        requestId: data.requestId,
        timestamp: new Date().toISOString(),
        status: "Approved",
        submittedBy: data.submittedBy,
        customer: data.customer,
        customerEmail: data.customerEmail,
        industry: data.industry,
        part: data.part,
        material: data.material,
        size: data.size,
        quantity: data.quantity,
        finish: data.finish,
        marking: data.marking,
        rush: data.rush,
        notes: data.notes || "",
        unitPrice: modifiedPrice,
        priceRange: data.priceRange,
        total: modifiedTotal,
        confidence: data.confidence,
        approvedBy: "Owner" + (priceChanged ? ` (modified from $${data.unitPrice})` : ""),
      });
      setDone(true);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to send approval. Please try again.");
    }
    setSending(false);
  };

  const card = {
    background: '#16093a', border: '1px solid rgba(139,92,246,0.5)',
    borderRadius: 12, padding: 24, backdropFilter: "blur(12px)",
  };

  if (done) {
    return (
      <div style={{ background: B.bg, minHeight: "100vh", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@700;800&display=swap');`}</style>
        <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease", maxWidth: 500 }}>
          <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>✓</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: B.text, marginBottom: 12 }}>Quote Approved</div>
          <div style={{ color: B.muted, fontSize: 14, lineHeight: 1.7 }}>
            {priceChanged
              ? `Price updated to $${modifiedPrice}/unit ($${modifiedTotal} total). Confirmation email will be sent to ${data.customer}.`
              : `Quote for ${data.customer} approved at $${modifiedPrice}/unit ($${modifiedTotal} total). Confirmation email will be sent.`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: B.bg, minHeight: "100vh", fontFamily: "'DM Mono', monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow   { 0%,100%{opacity:0.15} 50%{opacity:0.28} }
        input:focus { border-color: #8b5cf6 !important; box-shadow: 0 0 0 2px rgba(139,92,246,0.2) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030014; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "15%", left: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", animation: "glow 5s ease infinite" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", animation: "glow 5s ease infinite 2.5s" }} />
      </div>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(20px)", background: "rgba(15,7,41,0.85)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", fontSize: 14, letterSpacing: 3, fontWeight: 700, padding: "6px 12px", borderRadius: 6, boxShadow: "0 0 20px rgba(139,92,246,0.6)" }}>PR1SM</div>
          <div>
            <div style={{ color: B.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>Pricing Engine</div>
            <div style={{ color: B.muted, fontSize: 13, letterSpacing: 2, marginTop: 1 }}>OWNER APPROVAL · QUOTE REVIEW</div>
          </div>
        </div>
        <Badge label="ESCALATED" color={B.warning} glow />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "32px 24px", animation: "fadeUp 0.4s ease" }}>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: B.text }}>Quote Requires Your Approval</div>
          <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>Review the AI-recommended pricing below. Approve as-is or adjust the price.</div>
        </div>

        {/* Customer & Part Info */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#c4b5fd', textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Quote Details · {data.requestId}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["Customer", data.customer],
              ["Email", data.customerEmail],
              ["Industry", data.industry],
              ["Part", data.part],
              ["Material", data.material],
              ["Size", data.size],
              ["Quantity", data.quantity + " units"],
              ["Finish", data.finish],
              ["Marking", data.marking],
              ["Rush", data.rush],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
                <span style={{ fontSize: 13, color: B.muted }}>{k}</span>
                <span style={{ fontSize: 13, color: B.text, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div style={{ ...card, marginBottom: 16, borderColor: "rgba(34,197,94,0.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#67e8f9', textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(34,197,94,0.3)', paddingBottom: 8 }}>System Recommendation</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: B.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Unit Price</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>${data.unitPrice}</div>
            </div>
            <div>
              <div style={{ color: B.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Total</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: B.text }}>${data.total}</div>
            </div>
            <div>
              <div style={{ color: B.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Range</div>
              <div style={{ fontSize: 14, color: B.muted }}>${data.priceRange} / unit</div>
            </div>
            <div>
              <div style={{ color: B.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Confidence</div>
              <Badge label={data.confidence} color={data.confidence === "HIGH" ? B.success : data.confidence === "MEDIUM" ? B.warning : B.danger} glow />
            </div>
          </div>
        </div>

        {/* Price Adjustment */}
        <div style={{ ...card, marginBottom: 24, borderColor: "rgba(139,92,246,0.6)", background: "linear-gradient(135deg, #16093a, rgba(139,92,246,0.08))" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#c4b5fd', textTransform: "uppercase", marginBottom: 16, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Your Decision</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.muted, marginBottom: 6 }}>Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={modifiedPrice}
                onChange={e => setModifiedPrice(e.target.value)}
                style={{
                  width: "100%", padding: "14px 16px", background: "#1a0f3d",
                  border: `2px solid ${priceChanged ? B.warning : 'rgba(139,92,246,0.45)'}`,
                  borderRadius: 8, fontSize: 22, color: B.text, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box", outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
            <div style={{ textAlign: "center", paddingBottom: 4 }}>
              <div style={{ color: B.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>New Total</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: priceChanged ? B.warning : B.text }}>${modifiedTotal}</div>
              <div style={{ color: B.muted, fontSize: 12, marginTop: 2 }}>for {data.quantity} units</div>
            </div>
          </div>
          {priceChanged && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 6, fontSize: 12, color: B.warning }}>
              Price modified from ${data.unitPrice} to ${modifiedPrice} per unit
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleApprove}
            disabled={sending || !modifiedPrice}
            style={{
              flex: 1, padding: "16px",
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 14,
              letterSpacing: 2, textTransform: "uppercase", cursor: sending ? "wait" : "pointer",
              fontFamily: "'DM Mono', monospace", fontWeight: 600,
              boxShadow: "0 0 24px rgba(34,197,94,0.4)",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "APPROVING…" : priceChanged ? `APPROVE AT $${modifiedPrice}` : "APPROVE QUOTE"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────
export default function App() {
  const today     = new Date().toISOString().split("T")[0];
  const requestId = "QR-" + Date.now().toString(36).toUpperCase();

  // ── All hooks must be called unconditionally ──
  const [approvalData, setApprovalData] = useState(null);
  const [page, setPage] = useState("quote"); // "quote" | "audit"
  const [form, setForm] = useState({
    requestId, submittedBy: "Maria Santos", submittedDate: today, status: "Pending",
    customer: "", customerEmail: "", industry: "Aerospace", part: "Data Plate - Engine Serial",
    material: "Aluminum", length: "", width: "", thickness: "0.063",
    quantity: "", finish: "Anodized Black", marking: "Laser Engraved", rush: "No", notes: "",
  });
  const [step, setStep]       = useState("form");
  const [pricing, setPricing] = useState(null);
  const [error, setError]     = useState("");
  const [sending, setSending] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const approveParam = params.get("approve");
    if (approveParam) {
      try { setApprovalData(JSON.parse(atob(approveParam))); } catch (e) { /* invalid */ }
    }
  }, []);

  // ── Owner approval mode ──
  if (approvalData) return <OwnerApproval data={approvalData} />;

  const inp = {
    width: "100%", padding: "11px 14px",
    background: "#1a0f3d",
    border: '1px solid rgba(139,92,246,0.45)',
    borderRadius: 6, fontSize: 14, color: '#f1f5f9',
    fontFamily: "'DM Mono', monospace", boxSizing: "border-box", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const card = {
    background: '#16093a', border: '1px solid rgba(139,92,246,0.5)',
    borderRadius: 12, padding: 24, backdropFilter: "blur(12px)",
  };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.customer || !form.customerEmail || !form.length || !form.width || !form.quantity) {
      setError("Please fill in all required fields."); return;
    }
    setError(""); setStep("calculating");
    const p = calculatePrice(form);
    setPricing(p);
    setTimeout(() => setStep("result"), 600);
  };

  const buildAuditEntry = (action) => ({
    requestId: form.requestId,
    timestamp: new Date().toISOString(),
    status: action === "approved" ? "Approved" : action === "escalated" ? "Escalated" : "Rejected",
    submittedBy: form.submittedBy,
    customer: form.customer,
    customerEmail: form.customerEmail,
    industry: form.industry,
    part: form.part,
    material: form.material,
    size: `${form.length} x ${form.width} x ${form.thickness} in`,
    quantity: form.quantity,
    finish: form.finish,
    marking: form.marking,
    rush: form.rush,
    notes: form.notes,
    unitPrice: pricing?.unitPrice || "",
    priceRange: pricing ? `${pricing.low} - ${pricing.high}` : "",
    total: pricing?.total || "",
    confidence: pricing?.confidence || "",
    approvedBy: action === "approved" ? form.submittedBy : "",
  });

  const sendToWebhook = async (action) => {
    setSending(action);
    const webhookUrl = action === "escalated"
      ? "https://cloud.activepieces.com/api/v1/webhooks/slPOyPlR2N2vbG0Pf11JI"
      : "https://cloud.activepieces.com/api/v1/webhooks/VCabSdPLabpnL8aUnebLz";
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          requestId: form.requestId,
          submittedBy: form.submittedBy,
          customer: form.customer,
          customerEmail: form.customerEmail,
          industry: form.industry,
          part: form.part,
          material: form.material,
          size: `${form.length} x ${form.width} x ${form.thickness} in`,
          quantity: form.quantity,
          finish: form.finish,
          marking: form.marking,
          rush: form.rush,
          notes: form.notes,
          unitPrice: pricing.unitPrice,
          priceRange: `${pricing.low} - ${pricing.high}`,
          total: pricing.total,
          confidence: pricing.confidence,
          matchCount: pricing.matchCount,
          escalate: pricing.escalate,
          aiAnalysis: "",
          approvedBy: action === "approved" ? form.submittedBy : "",
          timestamp: new Date().toISOString(),
        }),
      });
      // Save to audit trail
      saveAuditEntry(buildAuditEntry(action));
      setSending("");
      alert(action === "approved" ? "Quote approved and sent!" : "Quote escalated to owner!");
    } catch (err) {
      console.error("Webhook error:", err);
      setSending("");
      alert("Failed to send. Please try again.");
    }
  };

  const handleReject = () => {
    saveAuditEntry(buildAuditEntry("rejected"));
    alert("Quote rejected.");
    reset();
  };

  const reset = () => {
    setStep("form"); setPricing(null);
    setForm(f => ({ ...f, customer: "", customerEmail: "", length: "", width: "", quantity: "", notes: "", requestId: "QR-" + Date.now().toString(36).toUpperCase() }));
  };

  const navBtn = (label, target) => (
    <button
      onClick={() => { setPage(target); }}
      style={{
        padding: "6px 16px", background: page === target ? "rgba(139,92,246,0.2)" : "transparent",
        border: page === target ? '1px solid rgba(139,92,246,0.5)' : '1px solid transparent',
        borderRadius: 6, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
        cursor: "pointer", color: page === target ? B.primary400 : B.muted,
        fontFamily: "'DM Mono', monospace", fontWeight: page === target ? 600 : 400,
        transition: "all 0.2s",
      }}
    >{label}</button>
  );

  return (
    <div style={{ background: B.bg, minHeight: "100vh", fontFamily: "'DM Mono', monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glow   { 0%,100%{opacity:0.15} 50%{opacity:0.28} }
        input:focus, select:focus, textarea:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 2px rgba(139,92,246,0.2) !important;
        }
        select option { background: #0f0729; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030014; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }
      `}</style>

      {/* BACKGROUND GLOWS */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "15%", left: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", animation: "glow 5s ease infinite" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", animation: "glow 5s ease infinite 2.5s" }} />
      </div>

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(20px)", background: "rgba(15,7,41,0.85)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", fontSize: 14, letterSpacing: 3, fontWeight: 700, padding: "6px 12px", borderRadius: 6, boxShadow: "0 0 20px rgba(139,92,246,0.6)" }}>PR1SM</div>
          <div>
            <div style={{ color: B.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>Pricing Engine</div>
            <div style={{ color: B.muted, fontSize: 13, letterSpacing: 2, marginTop: 1 }}>QUOTE REQUEST SYSTEM · AI-POWERED</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {navBtn("New Quote", "quote")}
          {navBtn("Audit Trail", "audit")}
          <div style={{ width: 1, height: 20, background: "rgba(139,92,246,0.3)", margin: "0 4px" }} />
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.success, boxShadow: `0 0 8px ${B.success}` }} />
          <span style={{ color: B.muted, fontSize: 14, letterSpacing: 1 }}>LIVE</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: page === "audit" ? 1200 : 960, margin: "0 auto", padding: "32px 24px", transition: "max-width 0.3s" }}>

        {/* ── AUDIT TRAIL ── */}
        {page === "audit" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: B.text, letterSpacing: -0.5 }}>Audit Trail</div>
              <div style={{ color: B.muted, fontSize: 13, marginTop: 5 }}>Complete history of all quotation actions — search, filter, and export for auditing.</div>
            </div>
            <AuditTrail onBack={() => setPage("quote")} />
          </div>
        )}

        {/* ── QUOTE FORM ── */}
        {page === "quote" && (
          <>
            {/* ── FORM ── */}
            {step === "form" && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: B.text, letterSpacing: -0.5 }}>New Quote Request</div>
                  <div style={{ color: B.muted, fontSize: 13, marginTop: 5 }}>Fill in the details below — AI will recommend a competitive price based on historical quote data.</div>
                </div>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderLeft: "3px solid #ef4444", borderRadius: 6, padding: "10px 14px", marginBottom: 20, fontSize: 14, color: B.danger }}>{error}</div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* LEFT */}
                  <div style={card}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#c4b5fd', textTransform: "uppercase", marginBottom: 18, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Customer Details</div>
                    <Field label="Submitted By">
                      <input style={inp} value={form.submittedBy} onChange={e => set("submittedBy", e.target.value)} />
                    </Field>
                    <Field label="Customer Name" required>
                      <input style={inp} placeholder="e.g. Bell Helicopter" value={form.customer} onChange={e => set("customer", e.target.value)} />
                    </Field>
                    <Field label="Customer Email" required>
                      <input style={inp} type="email" placeholder="e.g. procurement@bellhelicopter.com" value={form.customerEmail} onChange={e => set("customerEmail", e.target.value)} />
                    </Field>
                    <Field label="Industry" required>
                      <select style={inp} value={form.industry} onChange={e => set("industry", e.target.value)}>
                        {["Aerospace","Automotive","Defense","Medical","Industrial"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Part Name" required>
                      <select style={inp} value={form.part} onChange={e => set("part", e.target.value)}>
                        {["Data Plate - Engine Serial","VIN Plate - Cab Door","Equipment ID Plate","Warning Label","Device Serial Plate","Wiring Harness Tag","Equipment Nameplate","Airframe Plate","Cab Interior Plate","Surgical Instrument Tag","Interior Panel Placard","Axle Rating Plate","Implant ID Tag","Landing Gear Plate","Bumper ID Plate","Electronics Panel ID","Helicopter Interior Tag","Rotor Blade Tag","Vehicle ID Plate","Diagnostic Equipment Tag"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Special Requirements">
                      <textarea style={{ ...inp, height: 66, resize: "none" }} placeholder="e.g. AS9100 required, ITAR controlled, FDA UDI..." value={form.notes} onChange={e => set("notes", e.target.value)} />
                    </Field>
                  </div>

                  {/* RIGHT */}
                  <div style={card}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#c4b5fd', textTransform: "uppercase", marginBottom: 18, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Part Specifications</div>
                    <Field label="Material" required>
                      <select style={inp} value={form.material} onChange={e => set("material", e.target.value)}>
                        {["Aluminum","Stainless Steel","Titanium","Polyester","Brass"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <Field label="Length (in)" required>
                        <input style={inp} type="number" placeholder="4" value={form.length} onChange={e => set("length", e.target.value)} />
                      </Field>
                      <Field label="Width (in)" required>
                        <input style={inp} type="number" placeholder="2" value={form.width} onChange={e => set("width", e.target.value)} />
                      </Field>
                      <Field label="Thickness (in)">
                        <input style={inp} type="number" placeholder="0.063" value={form.thickness} onChange={e => set("thickness", e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Quantity" required>
                      <input style={inp} type="number" placeholder="75" value={form.quantity} onChange={e => set("quantity", e.target.value)} />
                    </Field>
                    <Field label="Finish">
                      <select style={inp} value={form.finish} onChange={e => set("finish", e.target.value)}>
                        {["Anodized Black","Anodized","Brushed","Electropolished","Paint","Alodine","Passivated","None"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <Field label="Marking Type">
                        <select style={inp} value={form.marking} onChange={e => set("marking", e.target.value)}>
                          {["Laser Engraved","Chemical Etch","Embossed","Silkscreen","Digital Print"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Rush Order">
                        <select style={inp} value={form.rush} onChange={e => set("rush", e.target.value)}>
                          <option>No</option><option>Yes</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </div>

                <button onClick={submit} style={{
                  width: "100%", marginTop: 20, padding: "15px",
                  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                  color: "#fff", border: "none", borderRadius: 8, fontSize: 13,
                  letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontWeight: 500,
                  boxShadow: "0 0 28px rgba(139,92,246,0.5)",
                }}>▶ Generate AI Price Recommendation</button>
              </div>
            )}

            {/* ── CALCULATING ── */}
            {step === "calculating" && (
              <div style={{ textAlign: "center", padding: "100px 0", animation: "fadeUp 0.4s ease" }}>
                <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 28px" }}>
                  <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(139,92,246,0.2)", borderRadius: "50%" }} />
                  <div style={{ position: "absolute", inset: 0, border: "2px solid transparent", borderTopColor: B.primary, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
                  <div style={{ position: "absolute", inset: 10, border: "1px solid transparent", borderTopColor: B.pink, borderRadius: "50%", animation: "spin 0.6s linear infinite reverse" }} />
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, color: B.text, fontWeight: 800, marginBottom: 8 }}>Analyzing Historical Data</div>
                <div style={{ color: B.muted, fontSize: 13, letterSpacing: 1, animation: "pulse 1.5s ease infinite" }}>Claude AI is generating your pricing recommendation…</div>
              </div>
            )}

            {/* ── RESULT ── */}
            {step === "result" && pricing && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: B.text, letterSpacing: -0.3 }}>Quote Recommendation</div>
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>{form.customer} · {form.industry} · {form.part}</div>
                  </div>
                  <button onClick={reset} style={{ padding: "8px 16px", background: B.glass, border: '1px solid rgba(139,92,246,0.45)', borderRadius: 6, fontSize: 14, letterSpacing: 2, cursor: "pointer", color: B.muted, fontFamily: "'DM Mono', monospace", backdropFilter: "blur(8px)" }}>↺ NEW QUOTE</button>
                </div>

                {/* Price strip */}
                <div style={{ background: "linear-gradient(135deg, #0f0729, rgba(139,92,246,0.18))", border: '1px solid rgba(139,92,246,0.45)', borderRadius: 12, padding: "28px 36px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 0 40px rgba(139,92,246,0.15)" }}>
                  <div>
                    <div style={{ color: B.muted, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Recommended Unit Price</div>
                    <div style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1 }}>${pricing.unitPrice}</div>
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 6 }}>Range: ${pricing.low} — ${pricing.high} / unit</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: B.muted, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Total Estimate</div>
                    <div style={{ color: B.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800 }}>${pricing.total}</div>
                    <div style={{ color: B.muted, fontSize: 13, marginTop: 4 }}>for {form.quantity} units</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: B.muted, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Confidence</div>
                    <Badge label={pricing.confidence} color={pricing.confidence === "HIGH" ? B.success : pricing.confidence === "MEDIUM" ? B.warning : B.danger} glow />
                    <div style={{ color: B.muted, fontSize: 14, marginTop: 8 }}>{pricing.matchCount} matches</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: B.muted, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Owner Approval</div>
                    <Badge label={pricing.escalate ? "REQUIRED" : "NOT NEEDED"} color={pricing.escalate ? B.danger : B.success} glow />
                    {pricing.rushApplied && <div style={{ color: B.warning, fontSize: 13, marginTop: 8, letterSpacing: 1 }}>+25% RUSH</div>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {/* Comparables */}
                  <div style={card}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#67e8f9', textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Comparable Quotes</div>
                    {pricing.comparables.length === 0 ? (
                      <div style={{ color: B.muted, fontSize: 12 }}>No direct comparables — manual review recommended.</div>
                    ) : pricing.comparables.map((q, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 8px", borderBottom: '1px solid rgba(139,92,246,0.3)' }}>
                        <div>
                          <div style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 500 }}>{q.customer}</div>
                          <div style={{ fontSize: 14, color: B.muted, marginTop: 2 }}>{q.material} · {q.size_length_in}×{q.size_width_in}in · qty {q.quantity}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>${q.unit_price_usd}</div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div style={card}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#67e8f9', textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Request Summary</div>
                    {[
                      ["Submitted By", form.submittedBy],
                      ["Customer", form.customer],
                      ["Email", form.customerEmail],
                      ["Industry", form.industry],
                      ["Part Name", form.part],
                      ["Material", form.material],
                      ["Size", `${form.length} × ${form.width} × ${form.thickness} in`],
                      ["Quantity", form.quantity],
                      ["Finish", form.finish],
                      ["Marking", form.marking],
                      ["Rush Order", form.rush],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: '1px solid rgba(139,92,246,0.3)' }}>
                        <span style={{ fontSize: 14, color: B.muted }}>{k}</span>
                        <span style={{ fontSize: 13, color: B.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Rationale */}
                {pricing.rationale && pricing.rationale.length > 0 && (
                  <div style={{ ...card, marginBottom: 16, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #7c3aed, #a855f7, #6366f1)" }} />
                    <div style={{ fontSize: 11, letterSpacing: 2, color: '#a855f7', textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>⚡</span> AI Pricing Rationale
                    </div>
                    {pricing.rationale.map((line, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < pricing.rationale.length - 1 ? 10 : 0 }}>
                        <span style={{ color: B.primary400, fontSize: 10, marginTop: 5, flexShrink: 0 }}>●</span>
                        <p style={{ margin: 0, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{line}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => sendToWebhook("approved")} disabled={!!sending} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: "'DM Mono', monospace", boxShadow: "0 0 20px rgba(34,197,94,0.3)", opacity: sending ? 0.6 : 1 }}>{sending === "approved" ? "SENDING…" : "✓ APPROVE & SEND"}</button>
                  <button onClick={() => sendToWebhook("escalated")} disabled={!!sending} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: "'DM Mono', monospace", boxShadow: "0 0 20px rgba(139,92,246,0.4)", opacity: sending ? 0.6 : 1 }}>{sending === "escalated" ? "SENDING…" : "↑ ESCALATE TO OWNER"}</button>
                  <button onClick={handleReject} style={{ padding: "14px 24px", background: B.glass, color: B.muted, border: '1px solid rgba(139,92,246,0.45)', borderRadius: 8, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Mono', monospace", backdropFilter: "blur(8px)" }}>✕ REJECT</button>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
