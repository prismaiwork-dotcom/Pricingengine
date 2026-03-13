import { useState, useEffect } from "react";

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
  return {
    unitPrice: unit, low: (base * 0.90).toFixed(2), high: (base * 1.15).toFixed(2),
    total, confidence: conf, matchCount: priced.length,
    comparables: priced.slice(0, 3),
    escalate: parseFloat(total) > 5000 || form.rush === "Yes",
    rushApplied: form.rush === "Yes",
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
      fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "4px 10px",
      background: `${color}18`, color, border: `1px solid ${color}40`,
      borderRadius: 20, fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 11,
      boxShadow: glow ? `0 0 10px ${color}40` : "none",
    }}>{label}</span>
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
      setSending("");
      alert(action === "approved" ? "Quote approved and sent!" : "Quote escalated to owner!");
    } catch (err) {
      console.error("Webhook error:", err);
      setSending("");
      alert("Failed to send. Please try again.");
    }
  };

  const reset = () => {
    setStep("form"); setPricing(null);
    setForm(f => ({ ...f, customer: "", customerEmail: "", length: "", width: "", quantity: "", notes: "", requestId: "QR-" + Date.now().toString(36).toUpperCase() }));
  };

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
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.success, boxShadow: `0 0 8px ${B.success}` }} />
          <span style={{ color: B.muted, fontSize: 14, letterSpacing: 1 }}>LIVE</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

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
                <div style={{ fontSize: 13, letterSpacing: 2, color: '#c4b5fd', fontSize: 11, textTransform: "uppercase", marginBottom: 18, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Customer Details</div>
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
                <div style={{ fontSize: 13, letterSpacing: 2, color: '#c4b5fd', fontSize: 11, textTransform: "uppercase", marginBottom: 18, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Part Specifications</div>
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
                <div style={{ fontSize: 13, letterSpacing: 2, color: '#67e8f9', fontSize: 11, textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Comparable Quotes</div>
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
                <div style={{ fontSize: 13, letterSpacing: 2, color: '#67e8f9', fontSize: 11, textTransform: "uppercase", marginBottom: 14, borderBottom: '1px solid rgba(139,92,246,0.3)', paddingBottom: 8 }}>Request Summary</div>
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

            {/* Actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => sendToWebhook("approved")} disabled={!!sending} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: "'DM Mono', monospace", boxShadow: "0 0 20px rgba(34,197,94,0.3)", opacity: sending ? 0.6 : 1 }}>{sending === "approved" ? "SENDING…" : "✓ APPROVE & SEND"}</button>
              <button onClick={() => sendToWebhook("escalated")} disabled={!!sending} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: sending ? "wait" : "pointer", fontFamily: "'DM Mono', monospace", boxShadow: "0 0 20px rgba(139,92,246,0.4)", opacity: sending ? 0.6 : 1 }}>{sending === "escalated" ? "SENDING…" : "↑ ESCALATE TO OWNER"}</button>
              <button onClick={reset} style={{ padding: "14px 24px", background: B.glass, color: B.muted, border: '1px solid rgba(139,92,246,0.45)', borderRadius: 8, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Mono', monospace", backdropFilter: "blur(8px)" }}>✕ REJECT</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
