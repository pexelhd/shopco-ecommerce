const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

module.exports = requireAdmin;
