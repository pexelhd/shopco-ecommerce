const db = require('../config/database');

const getProducts = async (req, res) => {
  const { search = '', category = '', minPrice, maxPrice, page = 1, limit = 12 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = ['p.is_active = true'];
  const params = [];
  let i = 1;

  if (search) {
    where.push(`(p.name ILIKE $${i} OR p.description ILIKE $${i + 1})`);
    params.push(`%${search}%`, `%${search}%`);
    i += 2;
  }
  if (category) {
    where.push(`c.slug = $${i}`);
    params.push(category);
    i++;
  }
  if (minPrice) {
    where.push(`p.price >= $${i}`);
    params.push(parseFloat(minPrice));
    i++;
  }
  if (maxPrice) {
    where.push(`p.price <= $${i}`);
    params.push(parseFloat(maxPrice));
    i++;
  }

  const whereClause = 'WHERE ' + where.join(' AND ');

  const countResult = await db.query(
    `SELECT COUNT(*) as count FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  const products = await db.query(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause} ORDER BY p.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...params, parseInt(limit), offset]
  );

  res.json({
    success: true,
    data: products.rows,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  });
};

const getFeatured = async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_active = true ORDER BY p.created_at DESC LIMIT 8`
  );
  res.json({ success: true, data: rows });
};

const getCategories = async (req, res) => {
  const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
  res.json({ success: true, data: rows });
};

const getProduct = async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: rows[0] });
};

const createProduct = async (req, res) => {
  const { name, description, price, image_url, category_id, stock = 0, is_active = true } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { rows } = await db.query(
    `INSERT INTO products (name, slug, description, price, image_url, category_id, stock, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, slug, description || null, price, image_url || null, category_id || null, stock, is_active]
  );
  res.status(201).json({ success: true, data: rows[0] });
};

const updateProduct = async (req, res) => {
  const existing = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ success: false, message: 'Product not found' });

  const fields = { ...existing.rows[0], ...req.body };
  const slug = fields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { rows } = await db.query(
    `UPDATE products SET name=$1, slug=$2, description=$3, price=$4, image_url=$5,
     category_id=$6, stock=$7, is_active=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
    [fields.name, slug, fields.description || null, fields.price, fields.image_url || null,
     fields.category_id || null, fields.stock, fields.is_active, req.params.id]
  );
  res.json({ success: true, data: rows[0] });
};

const deleteProduct = async (req, res) => {
  const existing = await db.query('SELECT id FROM products WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ success: false, message: 'Product not found' });

  await db.query('UPDATE products SET is_active=false, updated_at=NOW() WHERE id=$1', [req.params.id]);
  res.json({ success: true, message: 'Product deactivated' });
};

module.exports = { getProducts, getFeatured, getCategories, getProduct, createProduct, updateProduct, deleteProduct };
