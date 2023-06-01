const {generateProduct} = require('../utils.js');
const mockingCtrl = {};

mockingCtrl.mockingProducts = (req, res) => {
    try {
        let products = [];
        for (let i=0; i<100;i++){
            products.push(generateProduct())
        }
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Productos creados`);
        res.status(200).send(products)
    } catch (err) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al crear los productos`);
        res.status(500).send(err);
    }
}

module.exports = mockingCtrl;