const {Router} = require('express');

const router = Router();

const {getTickets, getSpecificTicket, createTicket} = require('../controllers/tickets.controllers.js');

router.get('/', getTickets);

router.get('/:tid', getSpecificTicket);

router.post('/:cid/purchase', createTicket);

module.exports = router;