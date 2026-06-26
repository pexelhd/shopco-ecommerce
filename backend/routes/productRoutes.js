const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validators/productValidator');

router.get('/', ctrl.getProducts);
router.get('/featured', ctrl.getFeatured);
router.get('/categories', ctrl.getCategories);
router.get('/:id', ctrl.getProduct);
router.post('/', auth, validate(createProductSchema), ctrl.createProduct);
router.put('/:id', auth, validate(updateProductSchema), ctrl.updateProduct);
router.delete('/:id', auth, ctrl.deleteProduct);

module.exports = router;
