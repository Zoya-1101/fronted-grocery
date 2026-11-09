export default function Notification() {
  const notes = [
    { id: 1, type: "✅ Order Confirmed", text: "Your Whole Milk subscription is confirmed for tomorrow 7 AM" },
    { id: 2, type: "🚚 Delivery Update", text: "Your Onion order is out for delivery - 9-12 PM slot" },
    { id: 3, type: "⚠️ Low Balance", text: "Wallet balance is low - ₹42 left. Please recharge." },
    { id: 4, type: "⏭️ Skipped Item", text: "Potato skipped for Monday as per your request" },
  ];
  return (
    <div>
      {notes.map(n => (
        <div key={n.id} className="dash-card">
          <b>{n.type}</b>
          <p>{n.text}</p>
        </div>
      ))}
    </div>
  );
}