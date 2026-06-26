const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ success: false, message: 'Email already in use' });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const result = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, password_hash]
  );

  const user = result.rows[0];
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ success: true, data: { token, user } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email } } });
};

module.exports = { register, login };
