const BASE = 'http://ecommerce-alb-263270954.eu-north-1.elb.amazonaws.com/api';

const getSessionId = () => {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('session_id', id);
  }
  return id;
};

const headers = () => ({
  'Content-Type':  'application/json',
  'x-session-id':  getSessionId(),
});

export const api = {
  getProducts:    (params = '') => fetch(`${BASE}/products?${params}`, { headers: headers() }).then(r => r.json()),
  getProduct:     (id)          => fetch(`${BASE}/products/${id}`,      { headers: headers() }).then(r => r.json()),
  getCategories:  ()            => fetch(`${BASE}/products/categories`,  { headers: headers() }).then(r => r.json()),
  getCart:        ()            => fetch(`${BASE}/cart`,                 { headers: headers() }).then(r => r.json()),
  addToCart:      (product_id, quantity = 1) =>
    fetch(`${BASE}/cart`, { method: 'POST', headers: headers(), body: JSON.stringify({ product_id, quantity }) }).then(r => r.json()),
  updateCart:     (id, quantity) =>
    fetch(`${BASE}/cart/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ quantity }) }).then(r => r.json()),
  removeFromCart: (id) =>
    fetch(`${BASE}/cart/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),
  checkout:       () =>
    fetch(`${BASE}/cart/checkout`, { method: 'POST', headers: headers() }).then(r => r.json()),
};