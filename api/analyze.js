export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { form, pricing } = req.body;

    const prompt = `You are a pricing advisor for a nameplate manufacturer serving aerospace, automotive, defense, and medical OEM customers.

QUOTE REQUEST:
Customer: ${form.customer} | Industry: ${form.industry} | Part: ${form.part}
Material: ${form.material} | Size: ${form.length}x${form.width}in | Qty: ${form.quantity}
Finish: ${form.finish} | Marking: ${form.marking} | Rush: ${form.rush}
Notes: ${form.notes}

PRICING:
Unit: $${pricing.unitPrice} | Range: $${pricing.low}-$${pricing.high} | Total: $${pricing.total}
Confidence: ${pricing.confidence} | Matches: ${pricing.matchCount} | Escalate: ${pricing.escalate}

Respond ONLY in this exact format, no markdown, no asterisks:

RECOMMENDATION
$${pricing.unitPrice}/unit — $${pricing.total} total for ${form.quantity} units — ${pricing.confidence} confidence

RATIONALE
2 sentences on why this price fits based on material, industry, and historical data.

MARKET POSITION
1 sentence on competitiveness for this customer.

RISK FLAGS
- [risk or "None identified"]

OWNER ACTION
${pricing.escalate ? "YES — Owner approval required before sending." : "NO — Can be sent directly without owner approval."}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    const analysisText = data.content?.[0]?.text || "Analysis unavailable.";
    return res.status(200).json({ analysis: analysisText });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
