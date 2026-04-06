import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id }                    = useParams();
  const navigate                  = useNavigate();
  const { addToCart }             = useCart();
  const [product, setProduct]     = useState(null);
  const [qty, setQty]             = useState(1);
  const [added, setAdded]         = useState(false);

  useEffect(() => { api.getProduct(id).then(setProduct); }, [id]);

  if (!product) return <div style={{ textAlign:'center', padding:80 }}>Loading...</div>;

  const handleAdd = async () => {
    await addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
      <div style={styles.container}>
        <img src={product.image_url} alt={product.name} style={styles.img} />
        <div style={styles.info}>
          <span style={styles.category}>{product.category_name}</span>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.price}>₹{parseFloat(product.price).toLocaleString()}</div>
          <p style={{ color: product.stock > 0 ? '#2ecc71' : '#e74c3c', fontWeight:600 }}>
            {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
          </p>
          <div style={styles.qtyRow}>
            <label>Qty:</label>
            <input type="number" min={1} max={product.stock} value={qty}
              onChange={e => setQty(+e.target.value)} style={styles.qtyInput} />
          </div>
          <button style={{ ...styles.btn, background: added ? '#2ecc71' : '#e94560' }}
            onClick={handleAdd} disabled={product.stock < 1}>
            {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:      { maxWidth:1000, margin:'0 auto', padding:'32px 24px' },
  back:      { background:'none', border:'none', color:'#e94560', fontWeight:600, fontSize:15, cursor:'pointer', marginBottom:24 },
  container: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' },
  img:       { width:'100%', borderRadius:16, boxShadow:'0 4px 24px rgba(0,0,0,0.1)' },
  info:      { display:'flex', flexDirection:'column', gap:16 },
  category:  { fontSize:12, color:'#e94560', textTransform:'uppercase', fontWeight:700, letterSpacing:1 },
  name:      { fontSize:32, fontWeight:800, color:'#1a1a2e', margin:0 },
  desc:      { color:'#555', lineHeight:1.7, margin:0 },
  price:     { fontSize:36, fontWeight:800, color:'#1a1a2e' },
  qtyRow:    { display:'flex', alignItems:'center', gap:12 },
  qtyInput:  { width:70, padding:'8px 12px', borderRadius:8, border:'1.5px solid #ddd', fontSize:16 },
  btn:       { padding:'14px 0', borderRadius:10, border:'none', color:'#fff',
               fontWeight:700, fontSize:16, cursor:'pointer', transition:'background .3s' },
};