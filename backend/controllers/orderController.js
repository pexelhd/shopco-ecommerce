const db = require('../config/database');

const parseOrder = (o) => o ? { ...o, total_amount: parseFloat(o.total_amount) } : o;
const parseOrderItem = (i) => i ? { ...i, unit_price: parseFloat(i.unit_price), subtotal: parseFloat(i.subtotal) } : i;

const createOrder = async (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, notes, items } = req.body;

  const productIds = items.map((i) => i.product_id);
  const { rows: products } = await db.query(
    `SELECT id, name, price, stock, is_active FROM products WHERE id = ANY($1) AND is_active = true`,
    [productIds]
  );

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  for (const item of items) {
    const p = productMap[item.product_id];
    if (!p) return res.status(400).json({ success: false, message: `Product ${item.product_id} not found or unavailable` });
    if (p.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for "${p.name}"` });
  }

  const orderItems = items.map((item) => {
    const p = productMap[item.product_id];
    return { product_id: p.id, product_name: p.name, unit_price: p.price, quantity: item.quantity, subtotal: p.price * item.quantity };
  });

  const total_amount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [customer_name, customer_email, customer_phone || null, JSON.stringify(shipping_address), total_amount, notes || null]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.product_name, item.unit_price, item.quantity, item.subtotal]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    await client.query('COMMIT');

    const { rows: [order] } = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const { rows: savedItems } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    res.status(201).json({ success: true, data: { ...parseOrder(order), items: savedItems.map(parseOrderItem) } });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getOrders = async (req, res) => {
  const { status = '', page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  let where = '';

  if (status) {
    where = 'WHERE status = $1';
    params.push(status);
  }

  const countResult = await db.query(`SELECT COUNT(*) as count FROM orders ${where}`, params);
  const total = parseInt(countResult.rows[0].count);

  const { rows } = await db.query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, parseInt(limit), offset]
  );

  res.json({
    success: true, data: rows.map(parseOrder),
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  });
};

const getOrder = async (req, res) => {
  const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ success: false, message: 'Order not found' });

  const { rows: items } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id]);
  res.json({ success: true, data: { ...parseOrder(rows[0]), items: items.map(parseOrderItem) } });
};

const updateStatus = async (req, res) => {
  const existing = await db.query('SELECT id FROM orders WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ success: false, message: 'Order not found' });

  const { rows } = await db.query(
    'UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
    [req.body.status, req.params.id]
  );
  res.json({ success: true, data: parseOrder(rows[0]) });
};

module.exports = { createOrder, getOrders, getOrder, updateStatus };
