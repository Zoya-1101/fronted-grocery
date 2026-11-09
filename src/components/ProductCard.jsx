export default function ProductCard({ p, cart, setCart }) {
  return (
    <div className="new-card">
      <div className="new-img">{p.emoji}</div>
      <h3>{p.name}</h3>
      <p className="new-price">₹{p.price} per unit</p>
      <p className="new-stock">{p.stock} packs remaining</p>
      <div className="add-plan-btn qty-inside">
        <span className="qty-minus" onClick={() => {
          const idx = cart.findIndex(item => item.id === p.id);
          if (idx !== -1) { const newCart = [...cart]; newCart.splice(idx, 1); setCart(newCart); }
        }}>-</span>
        <span className="qty-num">Add</span>
        <span className="qty-plus" onClick={() => setCart([...cart, p])}>+</span>
      </div>
    </div>
  );
}