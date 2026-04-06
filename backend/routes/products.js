const router = require('express').Router();
const { getProducts, getProductById, getCategories } = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/',           getProducts);
router.get('/:id',        getProductById);

module.exports = router;