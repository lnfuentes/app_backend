const {Router} = require('express');
const router = Router();
const {isAuthenticated} = require('../middleware/auth.js');

const {renderProductsForm ,getProducts, createProduct, deleteProduct, updateProduct} = require('../controllers/products.controllers.js');

router.get('/admin', isAuthenticated, renderProductsForm);

router.get('/', getProducts);

router.post('/', isAuthenticated, createProduct);

router.delete('/delete', isAuthenticated, deleteProduct);

router.put('/update', isAuthenticated, updateProduct);

module.exports = router;