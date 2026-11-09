export default function PlanSelector({ plan, setPlan }) {
  const plans = ["Daily", "Alternate-Day", "Weekly", "Custom"];
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {plans.map(pl => (
        <button key={pl} onClick={() => setPlan(pl)}
          style={{ padding: "8px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "700",
            background: plan === pl ? "#7ab648" : "#eee",
            color: plan === pl ? "white" : "black" }}>{pl}</button>
      ))}
    </div>
  );
}