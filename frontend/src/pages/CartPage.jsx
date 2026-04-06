import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateItem, removeItem, placeOrder } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckout = async () => {
    const result = await placeOrder();
    if (result.orderId) setOrderSuccess(result);
  };

  if (orderSuccess) return (
    <div style={{ textAlign:'center', padding:80 }}>
      <div style={{ fontSize:64 }}>🎉</div>
      <h2 style={{ color:'#1a1a2e' }}>Order Placed Successfully!</h2>
      <p style={{ color:'#555' }}>Order #{orderSuccess.orderId} — Total: ₹{parseFloat(orderSuccess.total).toLocaleString()}</p>
      <Link to="/" style={{ color:'#e94560', fontWeight:600 }}>Continue Shopping →</Link>
    </div>
  );

  if (!cart.items.length) return (
    <div style={{ textAlign:'center', padding:80 }}>
      <div style={{ fontSize:64 }}>🛒</div>
      <h2 style={{ color:'#1a1a2e' }}>Your cart is empty</h2>
      <Link to="/" style={{ color:'#e94560', fontWeight:600 }}>Browse Products →</Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Shopping Cart</h1>
      <div style={styles.layout}>
        <div style={styles.items}>
          {cart.items.map(item => (
            <div key={item.id} style={styles.item}>
              <img src={item.image_url} alt={item.name} style={styles.img} />
              <div style={{ flex:1 }}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemPrice}>₹{parseFloat(item.price).toLocaleString()}</div>
              </div>
              <div style={styles.qtyControls}>
                <button onClick={() => updateItem(item.id, item.quantity-1)} style={styles.qtyBtn}>-</button>
                <span style={{ minWidth:24, textAlign:'center', fontWeight:600 }}>{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity+1)} style={styles.qtyBtn}>+</button>
              </div>
              <div style={styles.subtotal}>₹{(item.price * item.quantity).toLocaleString()}</div>
              <button onClick={() => removeItem(item.id)} style={styles.removeBtn}>✕</button>
            </div>
          ))}
        </div>
        <div style={styles.summary}>
          <h3 style={{ marginTop:0 }}>Order Summary</h3>
          <div style={styles.summaryRow}><span>Items ({cart.items.length})</span><span>₹{parseFloat(cart.total).toLocaleString()}</span></div>
          <div style={styles.summaryRow}><span>Shipping</span><span style={{ color:'#2ecc71' }}>Free</span></div>
          <hr />
          <div style={{ ...styles.summaryRow, fontWeight:700, fontSize:18 }}>
            <span>Total</span><span>₹{parseFloat(cart.total).toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} style={styles.checkoutBtn}>Place Order →</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:        { maxWidth:1100, margin:'0 auto', padding:'32px 24px' },
  title:       { fontSize:28, fontWeight:800, color:'#1a1a2e', marginBottom:32 },
  layout:      { display:'grid', gridTemplateColumns:'1fr 320px', gap:32, alignItems:'start' },
  items:       { display:'flex', flexDirection:'column', gap:16 },
  item:        { display:'flex', alignItems:'center', gap:16, background:'#fff', padding:16, borderRadius:12, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  img:         { width:80, height:80, objectFit:'cover', borderRadius:8 },
  itemName:    { fontWeight:600, color:'#1a1a2e', marginBottom:4 },
  itemPrice:   { color:'#666', fontSize:14 },
  qtyControls: { display:'flex', alignItems:'center', gap:8 },
  qtyBtn:      { width:30, height:30, borderRadius:6, border:'1.5px solid #ddd', background:'#fff', cursor:'pointer', fontSize:16, fontWeight:700 },
  subtotal:    { fontWeight:700, minWidth:80, textAlign:'right' },
  removeBtn:   { background:'none', border:'none', color:'#e94560', cursor:'pointer', fontSize:18 },
  summary:     { background:'#fff', padding:24, borderRadius:12, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  summaryRow:  { display:'flex', justifyContent:'space-between', marginBottom:12 },
  checkoutBtn: { width:'100%', padding:'14px 0', background:'#e94560', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:16, cursor:'pointer', marginTop:16 },
};