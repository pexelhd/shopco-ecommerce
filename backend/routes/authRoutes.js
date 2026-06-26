const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validators/authValidator');

router.post('/login', validate(loginSchema), login);
router.get('/me', auth, me);

module.exports = router;
