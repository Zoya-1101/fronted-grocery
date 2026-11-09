import { useState, useEffect } from "react";
import client from '../api/client'

function getEmoji(name) {
  if (!name) return "📦";
  const n = name.toLowerCase();
  if (n.includes("butter")) return "🧈";
  if (n.includes("curd") || n.includes("yogurt")) return "🥣";
  if (n.includes("bread")) return "🍞";
  if (n.includes("egg")) return "🥚";
  if (n.includes("milk")) return "🥛";
  if (n.includes("paneer") || n.includes("cheese")) return "🧀";
  if (n.includes("honey")) return "🍯";
  if (n.includes("coffee")) return "☕";
  if (n.includes("tea")) return "🍵";
  if (n.includes("apple")) return "🍎";
  if (n.includes("banana")) return "🍌";
  if (n.includes("tomato")) return "🍅";
  if (n.includes("onion")) return "🧅";
  if (n.includes("potato")) return "🥔";
  if (n.includes("oil")) return "🫒";
  if (n.includes("fruit")) return "🍎";
  if (n.includes("vegetable") || n.includes("veg")) return "🥦";
  return "📦";
}

// Real prices from your Subscribe page - for old orders where price was 0
function getPriceFromName(name) {
  if (!name) return 0;
  const n = name.toLowerCase();
  if (n.includes("whole milk")) return 55;
  if (n.includes("whole wheat bread")) return 40;
  if (n.includes("farm eggs")) return 84;
  if (n.includes("fresh apples")) return 120;
  if (n.includes("fresh curd")) return 45;
  if (n.includes("fresh butter")) return 55;
  if (n.includes("ripe bananas")) return 50;
  if (n.includes("fresh tomatoes")) return 28;
  if (n.includes("onion")) return 32;
  if (n.includes("potato")) return 30;
  if (n.includes("cooking oil")) return 145;
  if (n.includes("tea powder")) return 120;
  if (n.includes("milk")) return 55;
  if (n.includes("bread")) return 40;
  if (n.includes("egg")) return 84;
  if (n.includes("curd")) return 45;
  if (n.includes("butter")) return 55;
  return 50;
}

export default function MySubscriptions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
   client.get('/subscriptions')
  .then((res) => res.data)
  .then((d) => {
        if (!Array.isArray(d) || !d.length) {
          setSubs([]);
          return;
        }
      const mapped = d.map((s) => {
  const items = s.items || s.products || [];
  const names = items.map((p) => p.name || p.productId?.name || "Product").join(", ");
  let price = Number(s.totalAmount) || Number(s.total) || items.reduce((a, p) => a + (Number(p.price || p.unitPrice || p.productId?.price || 0) * (p.quantity || 1)), 0);
  // If price is still 0, use real price from name - for old orders
  if (!price) {
    price = items.reduce((a, p) => a + getPriceFromName(p.name || p.productId?.name || ""), 0);
    if (!price) price = getPriceFromName(names);
  }
  return {
    id: s._id,
    name: names || "Empty",
    emoji: getEmoji(names),
    price: price,
    freq: s.frequency || s.plan || "Daily",
    slot: s.deliverySlot || s.slot || "07:00 - 08:00 AM",
    area: s.area || s.address || "HSR Layout",
    status: (s.status || "ACTIVE").toUpperCase(),
    createdAt: s.createdAt,
    next: "Tomorrow, 7 AM",
  };
});
setSubs(mapped);
      })
      .catch(() => setSubs([]));
  }, []);

  const update = (id, status) => setSubs(subs.map((s) => (s.id === id ? { ...s, status } : s)));

  const topCardStyle = {
    background: "linear-gradient(135deg, #fff200 0%, #d4ff00 30%, #a3e635 60%, #65d800 100%)",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 22px rgba(163, 230, 53, 0.45), inset 0 1px 0 rgba(255,255,255,0.8)",
    border: "1px solid #eab308",
    color: "#1a2e00",
  };

  const lightCardStyle = {
    background: "linear-gradient(135deg, #fff9c4 0%, #fff59d 35%, #d9ffcc 70%, #b2ff99 100%)",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    border: "1px solid #e6d96b",
    color: "#1a2e00",
  };

  const activeCount = subs.filter((s) => s.status === "ACTIVE").length;
  const pausedCount = subs.filter((s) => s.status === "PAUSED").length;
  const emptyStyle = { ...lightCardStyle, textAlign: "center", padding: 24, fontSize: 15, lineHeight: 1.6 };

  return (
   <div style={{ padding: "14px 12px 22px 12px", background: "#ffffff", minHeight: "100vh", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
      <style>{`
  .dash-wrap { max-width: 1250px; margin: 0 auto; display: flex; gap: 20px; align-items: flex-start; box-sizing: border-box; padding-top: 6px; overflow: visible; }
  .dash-left { flex: 1.6; min-width: 0; box-sizing: border-box; }
  .dash-right { flex: 1; min-width: 0; box-sizing: border-box; position: sticky; top: 20px; }
  .dash-top { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 32px; padding: 4px 2px 6px 2px; }
  .dash-upcoming-card { display: flex; gap: 14px; align-items: center; padding: 16px; box-sizing: border-box; flex-wrap: wrap; }
  .dash-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 190px; flex-shrink: 0; }
  .hist-head, .hist-row { display: grid; grid-template-columns: 52px 1fr 52px 72px; padding: 14px 10px; font-size: 13px; word-break: break-word; }
  .hist-head { background: rgba(255,255,255,0.55); font-weight: 800; font-size: 12px; }
  @media (max-width: 1000px) {
    .dash-wrap { flex-direction: column !important; gap: 0 !important; padding: 6px 2px 0 2px !important; overflow: visible !important; }
    .dash-left, .dash-right { flex: none !important; width: 100% !important; min-width: 0 !important; }
    .dash-right { position: static !important; margin-top: 10px !important; }
    .dash-top { grid-template-columns: 1fr 1fr 1fr !important; gap: 7px !important; margin-bottom: 22px !important; padding: 4px 1px 6px 1px !important; }
    .dash-top > div { padding: 12px 4px !important; text-align: center !important; border-radius: 14px !important; min-width: 0 !important; overflow: hidden !important; word-break: break-word !important; }
    .dash-top .top-icon { font-size: 20px !important; line-height: 1.2 !important; }
    .dash-top .top-label { font-size: 10.5px !important; margin-top: 6px !important; line-height: 1.2 !important; }
    .dash-top .top-value { font-size: 17px !important; margin-top: 5px !important; line-height: 1.2 !important; }
    .dash-top .top-sub { font-size: 9.5px !important; margin-top: 3px !important; line-height: 1.2 !important; white-space: normal !important; }
    .dash-upcoming-card { flex-direction: column !important; align-items: stretch !important; }
    .dash-btns { width: 100% !important; grid-template-columns: 1fr 1fr !important; }
    .hist-head { display: none !important; }
    .hist-row { display: flex !important; flex-direction: column !important; gap: 2px !important; padding: 12px !important; }
  }
`}</style>
      <div className="dash-wrap">
        <div className="dash-left">
          <h2 style={{ marginBottom: 22 }}>My Dashboard</h2>
          <div className="dash-top">
            <div style={{ ...topCardStyle, textAlign: "center", padding: 18 }}>
              <div className="top-icon" style={{ fontSize: 28 }}>🩷</div>
              <div className="top-label" style={{ fontSize: 14, fontWeight: "bold", marginTop: 8 }}>Wallet Balance</div>
              <div className="top-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>₹520</div>
              <div className="top-sub" style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>Add Money →</div>
            </div>
            <div style={{ ...topCardStyle, textAlign: "center", padding: 18 }}>
              <div className="top-icon" style={{ fontSize: 28 }}>⭐</div>
              <div className="top-label" style={{ fontSize: 14, fontWeight: "bold", marginTop: 8 }}>Loyalty Points</div>
              <div className="top-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>120 pts</div>
              <div className="top-sub" style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>Discounts + Bundles</div>
            </div>
            <div style={{ ...topCardStyle, textAlign: "center", padding: 18 }}>
              <div className="top-icon" style={{ fontSize: 28 }}>📦</div>
              <div className="top-label" style={{ fontSize: 14, fontWeight: "bold", marginTop: 8 }}>Subscriptions</div>
              <div className="top-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>{activeCount} Active</div>
              <div className="top-sub" style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>{pausedCount} Paused</div>
            </div>
          </div>
          <h3 style={{ marginBottom: 16, marginTop: 8 }}>Upcoming Deliveries</h3>
          {subs.length === 0 ? (
            <div style={emptyStyle}>
              <div style={{ fontSize: 32 }}>📦</div>
              <div style={{ fontWeight: "800", marginTop: 8 }}>No upcoming deliveries yet</div>
              <div style={{ opacity: 0.8 }}>Go to Subscribe and create your first subscription!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 36 }}>
              {subs.map((s) => (
                <div key={s.id} className="dash-upcoming-card" style={{ ...lightCardStyle }}>
                  <div style={{ fontSize: 38, width: 60, height: 60, background: "white", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.emoji}</div>
                  <div className="up-info" style={{ flex: 1, minWidth: 180, lineHeight: 1.6, wordBreak: "break-word" }}>
                    <div style={{ fontSize: 17, fontWeight: "800" }}>{s.name}</div>
                    <div style={{ fontSize: 13.5 }}>₹{s.price} • {s.freq} • {s.slot}</div>
                    <div style={{ fontSize: 13.5 }}>{s.area} • Next: {s.next}</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Stock: Validated ✅ • Substitute: Allowed • <b style={{ color: s.status === "ACTIVE" ? "#145a00" : "red" }}>{s.status}</b></div>
                  </div>
                  <div className="dash-btns">
                    <button onClick={() => update(s.id, s.status === "PAUSED" ? "ACTIVE" : "PAUSED")} style={{ background: "#ffcc00", border: "none", padding: "10px 6px", borderRadius: 10, fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>{s.status === "PAUSED" ? "Resume" : "Pause"}</button>
                    <button onClick={() => update(s.id, "SKIPPED")} style={{ background: "#ff9f43", border: "none", padding: "10px 6px", borderRadius: 10, fontWeight: "bold", color: "white", cursor: "pointer", fontSize: 13 }}>Skip</button>
                    <button onClick={() => { const v = prompt("New Slot:", s.slot); if (v) setSubs(subs.map((x) => x.id === s.id ? { ...x, slot: v } : x)); }} style={{ background: "#4a90e2", border: "none", padding: "10px 6px", borderRadius: 10, fontWeight: "bold", color: "white", cursor: "pointer", fontSize: 13 }}>Change Slot</button>
                    <button onClick={() => { if (window.confirm("Cancel " + s.name + "?")) update(s.id, "CANCELLED"); }} style={{ background: "#ff5b5b", border: "none", padding: "10px 6px", borderRadius: 10, fontWeight: "bold", color: "white", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dash-right">
          <h3 style={{ marginBottom: 16 }}>Order History</h3>
          {subs.length === 0 ? (
            <div style={emptyStyle}>
              <div style={{ fontSize: 28 }}>🧾</div>
              <div style={{ fontWeight: "800", marginTop: 8 }}>No orders yet</div>
              <div style={{ opacity: 0.8 }}>Your delivered orders will show here.</div>
            </div>
          ) : (
            <div style={{ ...lightCardStyle, padding: 0, overflow: "hidden" }}>
              <div className="hist-head"><span>Date</span><span>Items</span><span>Amount</span><span>Status</span></div>
              {subs.map((s, i) => {
                const d = s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";
                return (
                  <div key={d + i} className="hist-row" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                    <span>{d}</span><span>{s.name}</span><span><b>₹{s.price}</b></span><span style={{ color: "#145a00", fontWeight: "bold" }}>✅ Delivered</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 30 }}></div>
    </div>
  );
}