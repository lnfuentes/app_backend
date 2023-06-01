const {Router} = require('express');
const loggerTest = require('../controllers/loggerTest.controller.js');

const router = Router();

router.get('/', loggerTest);

module.exports = router;