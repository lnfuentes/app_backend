const {Router} = require('express');
const {isAuthenticated} = require('../middleware/auth.js');

const router = Router();

const {getTickets, getSpecificTicket, createTicket} = require('../controllers/tickets.controllers.js');

router.get('/', isAuthenticated, getTickets);

router.get('/:tid', isAuthenticated, getSpecificTicket);

module.exports = router;