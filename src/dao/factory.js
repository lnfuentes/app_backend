const DBManagerMongo = require('./mongo/DBManager.js');
const DBManagerMemory = require('./memory/DBManager.js');
const {DB_TYPE} = require('../config/config.js');

let DATA;

switch (DB_TYPE) {
    case 'MONGO':
        console.log('inicio con mongo');

        DATA = {
            CartManager: DBManagerMongo.CartManager,
            ProductManager: DBManagerMongo.ProductManager,
            UserManager: DBManagerMongo.UserManager,
            TicketManager: DBManagerMongo.TicketManager
        };

        break;

    case 'MEMORY':
        console.log('inicio con memory');

        DATA = {
            CartManager: DBManagerMemory.CartManager,
            ProductManager: DBManagerMemory.ProductManager,
            UserManager: DBManagerMemory.UserManager,
            TicketManager: DBManagerMemory.TicketManager
        };

        break;
}

module.exports = DATA;