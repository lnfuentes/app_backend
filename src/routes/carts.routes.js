const {Router} = require('express');
const router = Router();

const {getCarts ,getCartId, createCart, addProductCart, deleteCart, deleteCartProduct, deleteAllProducts, updateCart, updateProductQuantity, purchase} = require('../controllers/carts.controllers.js');

router.get('/', getCarts);

router.get('/:cid', getCartId);

router.post('/', createCart);

router.post("/:cid/:pid", addProductCart);

router.post('/purchase/', purchase);

router.delete('/:cid', deleteCart);

router.delete('/:cid/products/:pid', deleteCartProduct);

router.delete('/:cid/products', deleteAllProducts);

router.put('/:cid', updateCart);

router.put('/:cid/products/:pid', updateProductQuantity);

module.exports = router;