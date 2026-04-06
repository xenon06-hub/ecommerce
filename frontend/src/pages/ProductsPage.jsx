import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => { api.getCategories().then(setCategories); }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 8 });
    if (search)   params.set('search',   search);
    if (category) params.set('category', category);
    api.getProducts(params.toString()).then(data => {
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    });
  }, [search, category, page]);

  return (
    <div style={styles.page}>
      <div style={styles.filters}>
        <input placeholder="Search products..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} style={styles.input} />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} style={styles.select}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : (
        <div style={styles.grid}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      <div style={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={styles.pageBtn}>← Prev</button>
        <span style={{ color:'#666' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} style={styles.pageBtn}>Next →</button>
      </div>
    </div>
  );
}

const styles = {
  page:       { maxWidth:1200, margin:'0 auto', padding:'32px 24px' },
  filters:    { display:'flex', gap:16, marginBottom:32 },
  input:      { flex:1, padding:'12px 16px', borderRadius:8, border:'1.5px solid #ddd', fontSize:15 },
  select:     { padding:'12px 16px', borderRadius:8, border:'1.5px solid #ddd', fontSize:15, minWidth:180 },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:24 },
  loading:    { textAlign:'center', padding:80, color:'#999', fontSize:18 },
  pagination: { display:'flex', justifyContent:'center', alignItems:'center', gap:24, marginTop:40 },
  pageBtn:    { padding:'10px 24px', borderRadius:8, border:'1.5px solid #e94560', background:'#fff', color:'#e94560', fontWeight:600, cursor:'pointer' },
};