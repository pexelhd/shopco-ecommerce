const db = require('../config/database');

const getProducts = (req, res) => {
  const { search = '', category = '', minPrice, maxPrice, page = 1, limit = 12 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = ['p.is_active = 1'];
  const params = [];

  if (search) {
    where.push('(p.name LIKE ? OR p.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    where.push('c.slug = ?');
    params.push(category);
  }
  if (minPrice) {
    where.push('p.price >= ?');
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    where.push('p.price <= ?');
    params.push(parseFloat(maxPrice));
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const total = db
    .prepare(
      `SELECT COUNT(*) as count FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}`
    )
    .get(...params).count;

  const products = db
    .prepare(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, parseInt(limit), offset);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

const getFeatured = (req, res) => {
  const products = db
    .prepare(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 8`
    )
    .all();
  res.json({ success: true, data: products });
};

const getCategories = (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json({ success: true, data: categories });
};

const getProduct = (req, res) => {
  const product = db
    .prepare(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`
    )
    .get(req.params.id);

  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

const createProduct = (req, res) => {
  const { name, description, price, image_url, category_id, stock = 0, is_active = true } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const result = db
    .prepare(
      `INSERT INTO products (name, slug, description, price, image_url, category_id, stock, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name, slug, description || null, price, image_url || null, category_id || null, stock, is_active ? 1 : 0);

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: product });
};

const updateProduct = (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

  const fields = { ...existing, ...req.body };
  const slug = fields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  db.prepare(
    `UPDATE products SET name=?, slug=?, description=?, price=?, image_url=?, category_id=?,
     stock=?, is_active=?, updated_at=datetime('now') WHERE id=?`
  ).run(
    fields.name, slug, fields.description || null, fields.price,
    fields.image_url || null, fields.category_id || null,
    fields.stock, fields.is_active ? 1 : 0, req.params.id
  );

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: product });
};

const deleteProduct = (req, res) => {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

  db.prepare("UPDATE products SET is_active=0, updated_at=datetime('now') WHERE id=?").run(req.params.id);
  res.json({ success: true, message: 'Product deactivated' });
};

module.exports = { getProducts, getFeatured, getCategories, getProduct, createProduct, updateProduct, deleteProduct };
