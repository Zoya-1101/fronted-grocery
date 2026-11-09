export default function SubscriptionCard({ s, onPause, onResume, onCancel }) {
  return (
    <div className="dash-card">
      <div className="dash-top">
        <h3>{s.name}</h3>
        <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span>
      </div>
      <p>Qty: {s.qty} • Plan: {s.plan} • Slot: {s.slot}</p>
      <p>Next: <b>{s.next}</b> • ₹{s.price}</p>
      <div className="dash-btns">
        {s.status === "Active"
          ? <button className="dash-btn pause" onClick={onPause}>Pause</button>
          : <button className="dash-btn resume" onClick={onResume}>Resume</button>}
        <button className="dash-btn skip" onClick={() => alert(`Skipped ${s.name}`)}>Skip Next</button>
        <button className="dash-btn cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}