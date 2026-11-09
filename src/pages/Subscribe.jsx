import { useState } from 'react'
import client from '../api/client'

const products = [
  { id: 1, name: 'Whole Milk (1L)', price: 55, stock: 15, emoji: '🥛' },
  { id: 2, name: 'Whole Wheat Bread', price: 40, stock: 15, emoji: '🍞' },
  { id: 3, name: 'Farm Eggs (6 pcs)', price: 84, stock: 15, emoji: '🥚' },
  { id: 4, name: 'Fresh Apples (1kg)', price: 120, stock: 10, emoji: '🍎' },
  { id: 5, name: 'Fresh Curd (500g)', price: 45, stock: 15, emoji: '🍶' },
  { id: 6, name: 'Fresh Butter (100g)', price: 55, stock: 15, emoji: '🧈' },
  { id: 7, name: 'Ripe Bananas (1 Dozen)', price: 50, stock: 15, emoji: '🍌' },
  { id: 8, name: 'Fresh Tomatoes (1kg)', price: 28, stock: 15, emoji: '🍅' },
  { id: 9, name: 'Onion (1kg)', price: 32, stock: 15, emoji: '🧅' },
  { id: 10, name: 'Potato (1kg)', price: 30, stock: 15, emoji: '🥔' },
  { id: 11, name: 'Cooking Oil (1L)', price: 145, stock: 15, emoji: '🫙' },
  { id: 12, name: 'Tea Powder (250g)', price: 120, stock: 15, emoji: '🍵' },
]

const slots = {
  Morning: ['06:00 - 07:00 AM', '07:00 - 08:00 AM', '08:00 - 09:00 AM', '09:00 - 10:00 AM', '10:00 - 11:00 AM'],
  Evening: ['04:00 - 05:00 PM', '05:00 - 06:00 PM', '06:00 - 07:00 PM'],
  Night: ['07:00 - 08:00 PM', '08:00 - 09:00 PM', '09:00 - 10:00 PM'],
}
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Subscribe() {
  const [cart, setCart] = useState([])
  const [area, setArea] = useState('HSR Layout')
  const [freq, setFreq] = useState('Daily')
  const [selectedDays, setSelectedDays] = useState([])
  const [slot, setSlot] = useState('07:00 - 08:00 AM')
  const [payment, setPayment] = useState('Wallet (₹520 balance)')
  const [showPopup, setShowPopup] = useState(false)
  const [shared, setShared] = useState(false)
  const [saving, setSaving] = useState(false)
  const total = cart.reduce((s, p) => s + p.price, 0)

  const toggleDay = (d) => {
    if (selectedDays.includes(d)) setSelectedDays(selectedDays.filter(x => x !== d))
    else setSelectedDays([...selectedDays, d])
  }

  const handleConfirm = async () => {
    if (cart.length === 0) {
      alert('Please add at least 1 product');
      return;
    }
    setSaving(true);
    try {
      const grouped = {};
      cart.forEach((p) => {
        if (!grouped[p.id]) grouped[p.id] = { name: p.name, price: p.price, quantity: 0 };
        grouped[p.id].quantity += 1;
      });
      const items = Object.values(grouped);
      const payload = {
        items: items,
        area: area,
        frequency: freq,
        days: freq === 'Custom' ? selectedDays : [],
        deliverySlot: slot,
        paymentMethod: payment,
        totalAmount: total,
        shared: shared
      };
      const res = await client.post('/subscriptions', payload);
      console.log('Saved to backend:', res.data);
      setShared(false);
      setShowPopup(true);
    } catch (err) {
      console.log(err);
      setShared(false);
      setShowPopup(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="friend-app">
      <div className="friend-layout subscribe-layout">
        <div className="subscribe-left">
          <h2>1. Select Essentials</h2>
          <p className="scroll-hint">Scroll inside to see more products ↓</p>
          {/* 3 COLUMNS x 2 ROWS VISIBLE, SCROLL INSIDE */}
          <div className="new-grid subscribe-scroll-box">
            {products.map(p => (
              <div key={p.id} className="new-card subscribe-compact-card">
                <div className="new-img">{p.emoji}</div>
                <h3>{p.name}</h3>
                <p className="new-price">₹{p.price} per unit</p>
                <p className="new-stock">{p.stock} packs remaining</p>
                <div className="add-plan-btn qty-inside">
                  <span className="qty-minus" onClick={() => {
                    const idx = cart.findIndex(item => item.id === p.id);
                    if (idx !== -1) {
                      const newCart = [...cart];
                      newCart.splice(idx, 1);
                      setCart(newCart);
                    }
                  }}>-</span>
                  <span className="qty-num">Add</span>
                  <span className="qty-plus" onClick={() => setCart([...cart, p])}>+</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="friend-plan subscribe-right">
          <h2>2. Subscription Plan</h2>
          <label>Delivery Area</label>
          <input value={area} onChange={e => setArea(e.target.value)} />
          <label>Frequency</label>
          <div className="freq-row">
            {['Daily', 'Alternate Day', 'Weekly', 'Custom'].map(f => (
              <button key={f} className={freq === f ? 'freq active' : 'freq'} onClick={() => setFreq(f)}>{f}</button>
            ))}
          </div>

          {freq === 'Custom' && (
            <div className="days-box">
              <p><b>Select Days:</b></p>
              {days.map(d => (
                <label key={d} className="day-check"><input type="checkbox" checked={selectedDays.includes(d)} onChange={() => toggleDay(d)} /> {d}</label>
              ))}
            </div>
          )}

          <label>Delivery Slot</label>
          <select value={slot} onChange={e => setSlot(e.target.value)}>
            <optgroup label="🌅 Morning">{slots.Morning.map(s => <option key={s}>{s}</option>)}</optgroup>
            <optgroup label="🌇 Evening">{slots.Evening.map(s => <option key={s}>{s}</option>)}</optgroup>
            <optgroup label="🌙 Night">{slots.Night.map(s => <option key={s}>{s}</option>)}</optgroup>
          </select>

          <label>Payment</label>
          <select value={payment} onChange={e => setPayment(e.target.value)}>
            <option>Wallet (₹520 balance)</option><option>UPI</option><option>Cash on Delivery</option>
          </select>

          <div className="friend-cart">
            <b>Cart ({cart.length})</b>
            {cart.length === 0 ? <p>No items yet. Click Add to Plan.</p> : cart.map((c, i) => <p key={i}>{c.name} - ₹{c.price}</p>)}
            <h3>Total: ₹{total}</h3>
          </div>

          {/* STICKY CONFIRM - ALWAYS VISIBLE */}
          <div className="sticky-confirm-wrap">
            <button className="confirm sticky-confirm-btn" onClick={handleConfirm} disabled={saving}>{saving ? 'Saving...' : 'Confirm Subscription'}</button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-bg" onClick={() => setShowPopup(false)}>
          <div className="confirm-popup" onClick={e => e.stopPropagation()}>
            <div className="tick-wrap"><div className="tick-circle">✓</div></div>
            <h2 className="confirm-title">Your subscription</h2>
            <p className="confirm-sub">Confirmed!</p>
            <p className="share-text">Your subscription is now active.<br />Deliveries will begin as scheduled!</p>
            <p className="share-text">Please share with your family and friend.</p>
            <button className="share-btn" onClick={() => setShared(true)}>{shared ? 'Shared ✓ Thank You!' : 'Share'}</button>
            <button className="view-order-btn" onClick={() => setShowPopup(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  )
}