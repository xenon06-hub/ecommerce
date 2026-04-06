INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Clothing'),
  ('Books'),
  ('Home & Kitchen')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
  ('Wireless Headphones',    'Noise cancelling, 30hr battery',   2999.00, 50,  'https://placehold.co/400x300?text=Headphones',  1),
  ('Mechanical Keyboard',    'RGB backlit, tactile switches',     4999.00, 30,  'https://placehold.co/400x300?text=Keyboard',    1),
  ('Smartphone Stand',       'Adjustable aluminum desk stand',     799.00, 100, 'https://placehold.co/400x300?text=Stand',       1),
  ('Cotton T-Shirt',         'Premium 100% cotton, unisex',        499.00, 200, 'https://placehold.co/400x300?text=T-Shirt',     2),
  ('Denim Jacket',           'Classic fit, all seasons',          1999.00, 75,  'https://placehold.co/400x300?text=Jacket',      2),
  ('Running Shoes',          'Lightweight, breathable mesh',      2499.00, 60,  'https://placehold.co/400x300?text=Shoes',       2),
  ('Clean Code',             'By Robert C. Martin',                899.00, 40,  'https://placehold.co/400x300?text=Book',        3),
  ('The Pragmatic Programmer','Classic software dev book',         799.00, 35,  'https://placehold.co/400x300?text=Book',        3),
  ('Coffee Maker',           'Drip coffee, 12 cup capacity',      3499.00, 25,  'https://placehold.co/400x300?text=Coffee+Maker',4),
  ('Desk Lamp',              'LED, adjustable brightness',         999.00, 80,  'https://placehold.co/400x300?text=Lamp',        4)
ON CONFLICT DO NOTHING;