const {Router} = require('express');
const router = Router();

const {mockingProducts} = require('../controllers/mockingproducts.controllers.js');

router.get('/', mockingProducts);

module.exports = router;