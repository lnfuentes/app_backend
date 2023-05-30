const {Router} = require('express');
const router = Router();
const {isAuthenticated} = require('../middleware/auth.js');

const {mockingProducts} = require('../controllers/mockingproducts.controllers.js');

router.get('/', isAuthenticated, mockingProducts);

module.exports = router;