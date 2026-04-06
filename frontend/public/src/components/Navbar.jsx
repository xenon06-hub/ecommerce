import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛍️ ShopApp</Link>
      <div style={styles.links}>
        <Link to="/"     style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>
          Cart {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav:   { display:'flex', justifyContent:'space-between', alignItems:'center',
           padding:'14px 32px', background:'#1a1a2e', color:'#fff', position:'sticky', top:0, zIndex:100 },
  logo:  { fontSize:22, fontWeight:700, color:'#e94560', textDecoration:'none' },
  links: { display:'flex', gap:24 },
  link:  { color:'#fff', textDecoration:'none', fontSize:15, display:'flex', alignItems:'center', gap:6 },
  badge: { background:'#e94560', borderRadius:999, padding:'2px 8px', fontSize:12 },
};