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

const getProfile = async (req, res) => {
  const { rows } = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: rows[0] });
};

const updateProfile = async (req, res) => {
  const { name, email, password, currentPassword } = req.body;

  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const user = rows[0];
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Check email uniqueness if changing
  if (email && email !== user.email) {
    const existing = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.user.id]);
    if (existing.rows.length > 0) return res.status(409).json({ success: false, message: 'Email already in use' });
  }

  // Verify current password if changing password
  if (password) {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
  }

  const newName = name || user.name;
  const newEmail = email || user.email;
  const newHash = password ? bcrypt.hashSync(password, 10) : user.password_hash;

  const result = await db.query(
    'UPDATE users SET name=$1, email=$2, password_hash=$3 WHERE id=$4 RETURNING id, name, email, created_at',
    [newName, newEmail, newHash, req.user.id]
  );

  const updated = result.rows[0];
  const token = jwt.sign({ id: updated.id, email: updated.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, data: { user: updated, token } });
};

module.exports = { register, login, getProfile, updateProfile };
