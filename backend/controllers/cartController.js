const db = require('../config/db');

const getCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) return res.status(400).json({ error: 'Missing session ID' });
    const result = await db.query(
      `SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price, p.image_url
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.session_id = $1`,
      [sessionId]
    );
    const total = result.rows.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items: result.rows, total: parseFloat(total).toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    const { product_id, quantity = 1 } = req.body;
    if (!sessionId || !product_id) return res.status(400).json({ error: 'Missing fields' });
    const result = await db.query(
      `INSERT INTO cart (session_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (session_id, product_id)
       DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
       RETURNING *`,
      [sessionId, product_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await db.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
      return res.json({ message: 'Item removed' });
    }
    const result = await db.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkout = async (req, res) => {
  const client = await db.connect();
  try {
    const sessionId = req.headers['x-session-id'];
    await client.query('BEGIN');
    const cartResult = await client.query(
      `SELECT c.quantity, p.id AS product_id, p.price, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.session_id = $1`,
      [sessionId]
    );
    if (!cartResult.rows.length) return res.status(400).json({ error: 'Cart is empty' });
    for (const item of cartResult.rows) {
      if (item.quantity > item.stock)
        return res.status(400).json({ error: `Insufficient stock` });
    }
    const total = cartResult.rows.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await client.query(
      'INSERT INTO orders (session_id, total_amount) VALUES ($1, $2) RETURNING *',
      [sessionId, total]
    );
    const orderId = order.rows[0].id;
    for (const item of cartResult.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    await client.query('DELETE FROM cart WHERE session_id = $1', [sessionId]);
    await client.query('COMMIT');
    res.json({ message: 'Order placed!', orderId, total: parseFloat(total).toFixed(2) });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, checkout };