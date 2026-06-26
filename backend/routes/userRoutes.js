const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/userValidator');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
