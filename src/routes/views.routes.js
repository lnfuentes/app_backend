const {Router} = require('express');
const {renderProducts, renderProductId, renderCart} = require('../controllers/views.controllers.js');

const router = Router();

router.get("/", renderProducts);

router.get('/product/:pid', renderProductId)

router.get("/cart", renderCart);

module.exports = router;