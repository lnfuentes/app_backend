const {Router} = require('express');
const router = Router();
const {isAuthenticated} = require('../middleware/auth.js');

const {renderProductsForm ,getProducts, createProduct, deleteProduct, updateProduct} = require('../controllers/products.controllers.js');

router.get('/admin', isAuthenticated, renderProductsForm);

router.get('/', getProducts);

router.post('/', createProduct);

router.delete('/delete', deleteProduct);

router.put('/update', updateProduct);

module.exports = router;