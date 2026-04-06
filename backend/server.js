require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const pool    = require('./config/db');

const productRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Auto-initialize database ──────────────────────────────────
async function initDB() {
  const client = await pool.connect();
  try {
    console.log(' Initializing database...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(session_id, product_id)
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL
      );
    `);

    await client.query(`
      INSERT INTO categories (name) VALUES
        ('Electronics'),('Clothing'),('Books'),('Home & Kitchen')
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
        ('Wireless Headphones','Noise cancelling, 30hr battery',2999.00,50,'https://placehold.co/400x300?text=Headphones',1),
        ('Mechanical Keyboard','RGB backlit, tactile switches',4999.00,30,'https://placehold.co/400x300?text=Keyboard',1),
        ('Smartphone Stand','Adjustable aluminum desk stand',799.00,100,'https://placehold.co/400x300?text=Stand',1),
        ('Cotton T-Shirt','Premium 100% cotton, unisex',499.00,200,'https://placehold.co/400x300?text=T-Shirt',2),
        ('Denim Jacket','Classic fit, all seasons',1999.00,75,'https://placehold.co/400x300?text=Jacket',2),
        ('Running Shoes','Lightweight, breathable mesh',2499.00,60,'https://placehold.co/400x300?text=Shoes',2),
        ('Clean Code','By Robert C. Martin',899.00,40,'https://placehold.co/400x300?text=Book',3),
        ('The Pragmatic Programmer','Classic software dev book',799.00,35,'https://placehold.co/400x300?text=Book',3),
        ('Coffee Maker','Drip coffee, 12 cup capacity',3499.00,25,'https://placehold.co/400x300?text=Coffee+Maker',4),
        ('Desk Lamp','LED, adjustable brightness',999.00,80,'https://placehold.co/400x300?text=Lamp',4)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error(' DB init error:', err.message);
  } finally {
    client.release();
  }
}

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(` Backend running on http://localhost:${PORT}`);
  await initDB();
});