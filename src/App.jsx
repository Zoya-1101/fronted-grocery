import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Subscribe from "./pages/Subscribe";
import MySubscriptions from "./pages/MySubscriptions";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function Navbar() {
const navigate = useNavigate();
const location = useLocation();
const [showNotif, setShowNotif] = useState(false);
   const [notifs, setNotifs] = useState([
    { title: "Order Confirmed ✅", desc: "Your order Whole Milk + Bread is confirmed for tomorrow 7 AM.", time: "2 min ago" },
    { title: "Delivery Update 🚚", desc: "Your delivery is out for delivery. Arriving in 30 mins.", time: "1 hr ago" },
    { title: "Low Balance ⚠️", desc: "Your wallet balance is low - ₹120 left. Please add money.", time: "3 hrs ago" },
    { title: "Item Skipped ⏭️", desc: "Farm Eggs skipped for tomorrow as per your request.", time: "Yesterday" },
    { title: "Failed Payment ❌", desc: "Payment of ₹84 failed. Please retry.", time: "Yesterday" },
  ]);

  useEffect(() => {
    fetch("https://backened-groceries.onrender.com/api/subscriptions")
      .then((r) => r.json())
      .then((d) => {
        if (!Array.isArray(d) || !d.length) return;
               const mapped = d.slice(0, 5).map((s) => {
          const name = (s.products || []).map((p) => p.productId?.name || "Product").join(", ") || "Subscription";
          return {
            title: "Order Confirmed ✅",
            desc: `Your order ${name} is confirmed for tomorrow ${s.slot || "7 AM"}.`,
            time: s.createdAt
              ? new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
              : "2 min ago",
          };
        });
        setNotifs(mapped);
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ display: "flex", gap: "12px", padding: "14px 20px", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e6d96b", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => navigate("/subscribe")} style={{ background: location.pathname === "/subscribe" ? "#65a30d" : "white", color: location.pathname === "/subscribe" ? "white" : "#1a2e00", padding: "8px 16px", borderRadius: 20, border: "none", fontWeight: "bold", cursor: "pointer" }}>Subscribe</button>
        <button onClick={() => navigate("/my-subscriptions")} style={{ background: location.pathname === "/my-subscriptions" ? "#65a30d" : "white", color: location.pathname === "/my-subscriptions" ? "white" : "#1a2e00", padding: "8px 16px", borderRadius: 20, border: "none", fontWeight: "bold", cursor: "pointer" }}>Dashboard</button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
        <button onClick={() => navigate("/admin")} style={{ background: location.pathname === "/admin" ? "#65a30d" : "white", color: location.pathname === "/admin" ? "white" : "#1a2e00", padding: "8px 16px", borderRadius: 20, border: "none", fontWeight: "bold", cursor: "pointer" }}>Admin</button>
        <button onClick={() => setShowNotif(!showNotif)} style={{ background: "white", border: "none", width: 38, height: 38, borderRadius: "50%", fontSize: 18, cursor: "pointer", position: "relative" }}>🔔<span style={{ position: "absolute", top: 2, right: 2, background: "red", color: "white", fontSize: 10, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>5</span></button>
        {showNotif && (
          <div style={{ position: "absolute", top: 48, right: 0, width: 330, background: "white", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflow: "hidden", zIndex: 20 }}>
            <div style={{ padding: "14px 16px", background: "white", fontweight: "800"}}>Notifications</div>
            {notifs.map((n, i) => (
              <div key={i} style={{ padding: "12px 16px", borderTop: "1px solid #eee" }}>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{n.desc}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{n.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Subscribe />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}