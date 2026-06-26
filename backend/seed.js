require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
  // Create tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      price NUMERIC NOT NULL,
      image_url TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pending',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      total_amount NUMERIC NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      unit_price NUMERIC NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal NUMERIC NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  `);
  console.log('Tables created.');

  // Seed admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@store.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await db.query('SELECT id FROM admins WHERE email = $1', [adminEmail]);
  if (existing.rows.length === 0) {
    const hash = bcrypt.hashSync(adminPassword, 10);
    await db.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [adminEmail, hash]);
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  // Seed categories
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Home & Living', slug: 'home-living' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  ];
  for (const cat of categories) {
    await db.query('INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT DO NOTHING', [cat.name, cat.slug]);
  }
  console.log('Categories seeded.');

  const { rows: catRows } = await db.query('SELECT id, slug FROM categories');
  const catMap = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));

  // Seed products
  const products = [
    { name: 'Wireless Bluetooth Headphones', description: 'Premium sound quality with active noise cancellation and 30-hour battery life.', price: 89.99, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', category_id: catMap['electronics'], stock: 50 },
    { name: 'Smart Watch Pro', description: 'Track your fitness, receive notifications, and monitor your health 24/7.', price: 199.99, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', category_id: catMap['electronics'], stock: 30 },
    { name: 'Portable Bluetooth Speaker', description: 'Waterproof speaker with 360° surround sound and 12-hour playback.', price: 59.99, image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', category_id: catMap['electronics'], stock: 75 },
    { name: 'USB-C Fast Charger 65W', description: 'Universal fast charger compatible with laptops, phones, and tablets.', price: 34.99, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600', category_id: catMap['electronics'], stock: 100 },
    { name: 'Classic Cotton T-Shirt', description: 'Soft, breathable 100% organic cotton tee. Available in multiple colors.', price: 24.99, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', category_id: catMap['clothing'], stock: 200 },
    { name: 'Slim Fit Chino Pants', description: 'Versatile slim-fit chinos made from stretch cotton blend. Perfect for any occasion.', price: 49.99, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', category_id: catMap['clothing'], stock: 80 },
    { name: 'Leather Crossbody Bag', description: 'Genuine leather bag with adjustable strap and multiple compartments.', price: 79.99, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', category_id: catMap['clothing'], stock: 40 },
    { name: 'Minimalist Sneakers', description: 'Lightweight everyday sneakers with memory foam insole and breathable mesh upper.', price: 69.99, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', category_id: catMap['clothing'], stock: 60 },
    { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 hand-crafted ceramic mugs, microwave and dishwasher safe.', price: 39.99, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600', category_id: catMap['home-living'], stock: 90 },
    { name: 'Scented Soy Candle Collection', description: 'Set of 3 hand-poured soy candles with essential oil blends: lavender, cedarwood, and citrus.', price: 44.99, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', category_id: catMap['home-living'], stock: 60 },
    { name: 'Yoga Mat Premium', description: 'Extra-thick non-slip yoga mat with alignment lines and carrying strap.', price: 54.99, image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', category_id: catMap['sports-outdoors'], stock: 45 },
    { name: 'Stainless Steel Water Bottle', description: 'Double-wall vacuum insulated bottle keeps drinks cold 24h or hot 12h. 32oz.', price: 29.99, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', category_id: catMap['sports-outdoors'], stock: 120 },
  ];

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await db.query(
      `INSERT INTO products (name, slug, description, price, image_url, category_id, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
      [p.name, slug, p.description, p.price, p.image_url, p.category_id, p.stock]
    );
  }
  console.log(`${products.length} products seeded.`);
  console.log('\nDatabase ready!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
