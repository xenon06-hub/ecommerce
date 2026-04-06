const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeFromCart, checkout } = require('../controllers/cartController');

router.get('/',          getCart);
router.post('/',         addToCart);
router.put('/:id',       updateCartItem);
router.delete('/:id',    removeFromCart);
router.post('/checkout', checkout);

module.exports = router;