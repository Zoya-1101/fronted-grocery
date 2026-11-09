import { useState, useEffect } from "react";
import client from '../api/client'

export default function Admin() {
  const [tab, setTab] = useState("Subscriptions");
  const [subs, setSubs] = useState([]);

 useEffect(() => {
  client.get('/subscriptions')
    .then((res) => setSubs(Array.isArray(res.data) ? res.data : []))
    .catch(() => setSubs([]));
}, []);

  const tabs = ["Subscriptions", "Delivery Routes", "Inventory", "Pricing", "Failed Payments"];

  // FRESH DATA ONLY - NO HARDCODED FAKE LISTS
  const data = {
    "Subscriptions": subs.length ? subs.map((s) => {
const names = (s.items || s.products || []).map((p) => p.name || p.productId?.name || "Product").join(", ");
return `${names || "Empty"} • ${s.frequency || s.plan} • ${s.deliverySlot || s.slot} • ${s.status || "Active"}`;
    }) : [],
    "Delivery Routes": [], // fresh - will come from backend later
    "Inventory": [], // fresh
    "Pricing": [], // fresh
    "Failed Payments": subs.filter((s) => (s.status || "").toUpperCase() === "FAILED").map((s) => {
      const names = (s.products || []).map((p) => p.productId?.name || "Product").join(", ");
      return `${names} • ₹${s.total || 0} • Payment Failed - Retry`;
    }),
  };

  // SHINING DARK YELLOW-GREEN - SAME AS SUBSCRIBE ADD BUTTON
  const darkCard = {
    background: "linear-gradient(135deg, #fff200 0%, #d4ff00 30%, #a3e635 60%, #65d800 100%)",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 22px rgba(163,230,53,0.45), inset 0 1px 0 rgba(255,255,255,0.8)",
    border: "1px solid #eab308",
    color: "#1a2e00",
  };

  // LIGHT CREAM COLOUR FOR RIGHT SIDE
  const lightCard = {
    background: "linear-gradient(135deg, #fff9c4 0%, #fff59d 35%, #d9ffcc 70%, #b2ff99 100%)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    border: "1px solid #e6d96b",
  };

  // FRESH COUNTS
  const totalSubs = subs.length;
  const totalOrdersToday = 0; // fresh - orders API not connected yet
  const revenueToday = subs.reduce((a, s) => a + (s.total || 0), 0);
  const failedCount = subs.filter((s) => (s.status || "").toUpperCase() === "FAILED").length;

  return (
    <div style={{ padding: "14px 12px 22px 12px", background: "#fffdf0", minHeight: "100vh", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
      <style>{`
        .admin-wrap { max-width: 1050px; margin: 0 auto; box-sizing: border-box; }
        .admin-flex { display: flex; gap: 20px; align-items: flex-start; box-sizing: border-box; }
        .admin-left { width: 250px; display: flex; flex-direction: column; gap: 16px; flex-shrink: 0; box-sizing: border-box; }
        .admin-right { flex: 1; min-width: 0; box-sizing: border-box; }
        .admin-tabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
        .admin-tabs button { padding: 10px 16px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; white-space: nowrap; }
        .admin-list-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; }

        @media (max-width: 1000px) {
          .admin-flex { flex-direction: column !important; gap: 0 !important; }
          .admin-left { width: 100% !important; display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin-bottom: 16px !important; }
          .admin-left > div { padding: 14px 6px !important; border-radius: 14px !important; min-width: 0 !important; overflow: hidden !important; }
          .admin-left .a-icon { font-size: 20px !important; }
          .admin-left .a-value { font-size: 22px !important; margin-top: 6px !important; }
          .admin-left .a-label { font-size: 11px !important; line-height: 1.2 !important; }
          .admin-right { width: 100% !important; }
          .admin-tabs { flex-wrap: nowrap !important; overflow-x: auto !important; padding-bottom: 6px !important; -webkit-overflow-scrolling: touch; }
          .admin-tabs button { flex-shrink: 0 !important; padding: 9px 13px !important; font-size: 13px !important; }
          .admin-list-item { flex-direction: column !important; align-items: stretch !important; }
          .admin-list-item button { width: 100% !important; padding: 10px !important; }
        }
      `}</style>

      <div className="admin-wrap">
        <h2 style={{ margin: "6px 0 22px" }}>Admin Dashboard</h2>

        <div className="admin-flex">

          {/* LEFT SIDE - 4 CARDS VERTICALLY ON LAPTOP, 2x2 ON PHONE */}
          <div className="admin-left">
            <div style={{ ...darkCard, textAlign: "center" }}>
              <div className="a-icon" style={{ fontSize: 26 }}>📦</div>
              <div className="a-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>{totalSubs}</div>
              <div className="a-label" style={{ fontSize: 14, fontWeight: "bold" }}>Total Subscriptions</div>
            </div>
            <div style={{ ...darkCard, textAlign: "center" }}>
              <div className="a-icon" style={{ fontSize: 26 }}>🛒</div>
              <div className="a-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>{totalOrdersToday}</div>
              <div className="a-label" style={{ fontSize: 14, fontWeight: "bold" }}>Total Orders Today</div>
            </div>
            <div style={{ ...darkCard, textAlign: "center" }}>
              <div className="a-icon" style={{ fontSize: 26 }}>💰</div>
              <div className="a-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>₹{revenueToday}</div>
              <div className="a-label" style={{ fontSize: 14, fontWeight: "bold" }}>Revenue Today</div>
            </div>
            <div style={{ ...darkCard, textAlign: "center" }}>
              <div className="a-icon" style={{ fontSize: 26 }}>⚠️</div>
              <div className="a-value" style={{ fontSize: 28, fontWeight: "800", marginTop: 6 }}>{failedCount}</div>
              <div className="a-label" style={{ fontSize: 14, fontWeight: "bold" }}>Failed Payments</div>
            </div>
          </div>

          {/* RIGHT SIDE - TABS HORIZONTALLY + LIGHT LIST */}
          <div className="admin-right">
            <div className="admin-tabs">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: tab === t ? "#65a30d" : "#fff9c4",
                  color: tab === t ? "white" : "#1a2e00",
                  boxShadow: tab === t ? "0 4px 12px rgba(101,163,13,0.4)" : "0 2px 6px rgba(0,0,0,0.08)"
                }}>{t}</button>
              ))}
            </div>

            {data[tab].length === 0 ? (
              <div style={{ ...lightCard, textAlign: "center", padding: 24, lineHeight: 1.6 }}>
                <div style={{ fontSize: 28 }}>📦</div>
                <div style={{ fontWeight: 800, marginTop: 8 }}>No {tab} yet</div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>When customer subscribes, it will show here.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {data[tab].map((item, i) => (
                  <div key={i} className="admin-list-item" style={{ ...lightCard }}>
                    <b style={{ fontSize: 15, wordBreak: "break-word" }}>{item}</b>
                    <button style={{ background: "#ffcc00", border: "none", padding: "7px 12px", borderRadius: 8, fontWeight: "bold", cursor: "pointer", flexShrink: 0 }}>View</button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}