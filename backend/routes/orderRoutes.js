const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createOrderSchema, updateStatusSchema } = require('../validators/orderValidator');

router.post('/', validate(createOrderSchema), ctrl.createOrder);
router.get('/', auth, ctrl.getOrders);
router.get('/:id', auth, ctrl.getOrder);
router.patch('/:id/status', auth, validate(updateStatusSchema), ctrl.updateStatus);

module.exports = router;
