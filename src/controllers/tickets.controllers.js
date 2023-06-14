const DATA = require('../dao/factory.js');
const ticketsCtrl = {};

const {TicketManager} = DATA;
const ticketManager = new TicketManager();

ticketsCtrl.getTickets = async (req, res) => {
    try {
        const tickets = ticketManager.getTickets();
        res.status(200).json(tickets);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al obtener los tickets`);
        res.status(500).json({error: error.message});
    }
}

ticketsCtrl.getSpecificTicket = async (req, res) => {
    try {
        const ticket = ticketManager.getTicket(req.params.id);
        res.status(200).json(ticket);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al obtener el ticket`);
        res.status(500).json({error: error.message});
    }
}

module.exports = ticketsCtrl;