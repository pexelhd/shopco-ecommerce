require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL DEFAULT 'pending',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    total_amount REAL NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal REAL NOT NULL
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
const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const hash = bcrypt.hashSync(adminPassword, 10);
  db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)').run(adminEmail, hash);
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

const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
for (const cat of categories) insertCat.run(cat.name, cat.slug);
console.log('Categories seeded.');

// Get category IDs
const catMap = Object.fromEntries(
  db.prepare('SELECT id, slug FROM categories').all().map((c) => [c.slug, c.id])
);

// Seed products
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium sound quality with active noise cancellation and 30-hour battery life.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    category_id: catMap['electronics'],
    stock: 50,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Track your fitness, receive notifications, and monitor your health 24/7.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    category_id: catMap['electronics'],
    stock: 30,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° surround sound and 12-hour playback.',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    category_id: catMap['electronics'],
    stock: 75,
  },
  {
    name: 'USB-C Fast Charger 65W',
    description: 'Universal fast charger compatible with laptops, phones, and tablets.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
    category_id: catMap['electronics'],
    stock: 100,
  },
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Soft, breathable 100% organic cotton tee. Available in multiple colors.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    category_id: catMap['clothing'],
    stock: 200,
  },
  {
    name: 'Slim Fit Chino Pants',
    description: 'Versatile slim-fit chinos made from stretch cotton blend. Perfect for any occasion.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
    category_id: catMap['clothing'],
    stock: 80,
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Genuine leather bag with adjustable strap and multiple compartments.',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    category_id: catMap['clothing'],
    stock: 40,
  },
  {
    name: 'Minimalist Sneakers',
    description: 'Lightweight everyday sneakers with memory foam insole and breathable mesh upper.',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    category_id: catMap['clothing'],
    stock: 60,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 hand-crafted ceramic mugs, microwave and dishwasher safe.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    category_id: catMap['home-living'],
    stock: 90,
  },
  {
    name: 'Scented Soy Candle Collection',
    description: 'Set of 3 hand-poured soy candles with essential oil blends: lavender, cedarwood, and citrus.',
    price: 44.99,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    category_id: catMap['home-living'],
    stock: 60,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick non-slip yoga mat with alignment lines and carrying strap.',
    price: 54.99,
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    category_id: catMap['sports-outdoors'],
    stock: 45,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated bottle keeps drinks cold 24h or hot 12h. 32oz.',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    category_id: catMap['sports-outdoors'],
    stock: 120,
  },
];

const insertProduct = db.prepare(
  `INSERT OR IGNORE INTO products (name, slug, description, price, image_url, category_id, stock)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

for (const p of products) {
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  insertProduct.run(p.name, slug, p.description, p.price, p.image_url, p.category_id, p.stock);
}
console.log(`${products.length} products seeded.`);
console.log('\nDatabase ready! Run: npm run dev');
