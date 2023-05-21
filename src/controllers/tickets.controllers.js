const DATA = require('../dao/factory.js');
const Crypto = require('crypto');
const ticketsCtrl = {};

const {TicketManager} = DATA;
const ticketManager = new TicketManager();

ticketsCtrl.getTickets = async (req, res) => {
    try {
        const tickets = ticketManager.getTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

ticketsCtrl.getSpecificTicket = async (req, res) => {
    try {
        const ticket = ticketManager.getTicket(req.params.id);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

ticketsCtrl.createTicket = async (req, res) => {
    const myTicket = {
        code: Crypto.randomBytes(16).toString('hex').substring(0, 4),
        purchase_datatime: req.body.purchase_datatime,
        amount: req.body.amount,
        purchaser: req.body.purchaser,
        created_at: new Date()
    }

    try {
        const ticket = ticketManager.create(myTicket);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = ticketsCtrl;