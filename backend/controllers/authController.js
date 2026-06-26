const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
  const admin = rows[0];

  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, data: { token, admin: { id: admin.id, email: admin.email } } });
};

const me = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

module.exports = { login, me };
