const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/userController');
const validate = require('../middleware/validate');
const userAuth = require('../middleware/userAuth');
const { registerSchema, loginSchema } = require('../validators/userValidator');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', userAuth, getProfile);
router.put('/profile', userAuth, updateProfile);

module.exports = router;
