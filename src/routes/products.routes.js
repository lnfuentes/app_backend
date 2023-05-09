const Router = require('express');
const router = Router();

const {getProducts, createProduct, deleteProduct, updateProduct} = require('../controllers/products.controllers.js');

router.get('/', getProducts);

router.post('/', createProduct);

router.delete('/:id', deleteProduct);

router.put('/:id', updateProduct);

module.exports = router;