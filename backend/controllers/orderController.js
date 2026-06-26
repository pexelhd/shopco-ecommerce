const db = require('../config/database');

const createOrder = (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, notes, items } = req.body;

  const productIds = items.map((i) => i.product_id);
  const placeholders = productIds.map(() => '?').join(',');
  const products = db
    .prepare(`SELECT id, name, price, stock, is_active FROM products WHERE id IN (${placeholders}) AND is_active = 1`)
    .all(...productIds);

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  for (const item of items) {
    const p = productMap[item.product_id];
    if (!p) {
      return res.status(400).json({ success: false, message: `Product ${item.product_id} not found or unavailable` });
    }
    if (p.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for "${p.name}"` });
    }
  }

  const orderItems = items.map((item) => {
    const p = productMap[item.product_id];
    return {
      product_id: p.id,
      product_name: p.name,
      unit_price: p.price,
      quantity: item.quantity,
      subtotal: p.price * item.quantity,
    };
  });

  const total_amount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

  const createOrderTx = db.transaction(() => {
    const orderResult = db
      .prepare(
        `INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, notes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        customer_name, customer_email, customer_phone || null,
        JSON.stringify(shipping_address), total_amount, notes || null
      );

    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`
    );

    for (const item of orderItems) {
      insertItem.run(orderId, item.product_id, item.product_name, item.unit_price, item.quantity, item.subtotal);
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
    }

    return orderId;
  });

  const orderId = createOrderTx();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const savedItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  res.status(201).json({ success: true, data: { ...order, items: savedItems } });
};

const getOrders = (req, res) => {
  const { status = '', page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  let where = '';

  if (status) {
    where = 'WHERE status = ?';
    params.push(status);
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM orders ${where}`).get(...params).count;
  const orders = db
    .prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, parseInt(limit), offset);

  res.json({
    success: true,
    data: orders,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  });
};

const getOrder = (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
  res.json({ success: true, data: { ...order, items } });
};

const updateStatus = (req, res) => {
  const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Order not found' });

  db.prepare("UPDATE orders SET status=?, updated_at=datetime('now') WHERE id=?").run(req.body.status, req.params.id);
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: order });
};

module.exports = { createOrder, getOrders, getOrder, updateStatus };
