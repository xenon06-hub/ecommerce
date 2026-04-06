import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  return (
    <div style={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img src={product.image_url} alt={product.name} style={styles.img} />
      </Link>
      <div style={styles.body}>
        <span style={styles.category}>{product.category_name}</span>
        <Link to={`/product/${product.id}`} style={styles.name}>{product.name}</Link>
        <p style={styles.desc}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{parseFloat(product.price).toLocaleString()}</span>
          <span style={{ color: product.stock > 0 ? '#2ecc71' : '#e74c3c', fontSize:12 }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <button
          style={{ ...styles.btn, opacity: product.stock < 1 ? 0.5 : 1 }}
          disabled={product.stock < 1 || loading}
          onClick={() => addToCart(product.id)}
        >
          {loading ? '...' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card:     { background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column' },
  img:      { width:'100%', height:200, objectFit:'cover' },
  body:     { padding:16, display:'flex', flexDirection:'column', gap:8, flex:1 },
  category: { fontSize:11, color:'#e94560', textTransform:'uppercase', fontWeight:600, letterSpacing:1 },
  name:     { fontWeight:700, fontSize:16, color:'#1a1a2e', textDecoration:'none' },
  desc:     { fontSize:13, color:'#666', margin:0, lineHeight:1.5 },
  footer:   { display:'flex', justifyContent:'space-between', alignItems:'center' },
  price:    { fontWeight:700, fontSize:18, color:'#1a1a2e' },
  btn:      { background:'#e94560', color:'#fff', border:'none', borderRadius:8, padding:'10px 0', fontWeight:600, cursor:'pointer', width:'100%', fontSize:14 },
};