const DATA = require('../dao/factory.js');
const mongoose = require('mongoose')
const viewsCtrl = {};

const {CartManager, ProductManager} = DATA;
const cartManager = new CartManager();
const productManager = new ProductManager();


viewsCtrl.renderProducts = async (req, res) => {
    res.render("products", { title: "Productos", style: '/css/products.css'});
}

viewsCtrl.renderProductId = async (req, res) => {
    const pid = req.params.pid;
    const cartId = req.session.cartId;
    const cid = cartId.valueOf();
    if (!pid || typeof pid !== 'string' || pid.length !== 24) {
        return res.status(400).send('Invalid product ID');
    }

    try {
        const objectPid = mongoose.Types.ObjectId(pid);
        const product = await productManager.findById(objectPid);
        res.render('product', { title: 'Detalle del producto', style: '/css/products.css', product, cid, pid });
    } catch (error) {
        res.status(500).send('Error retrieving product', error);
    }
}

viewsCtrl.renderCart = async (req, res) => {
    try {
        const cartId = req.session.cartId;
        const userCart = await cartManager.getCartById(cartId);
        const cart = userCart[0];
        res.render("cart", { title: "Carrito", cart});
    } catch (error) {
        res.status(500).send('Error retrieving cart', error)
    }
}

module.exports = viewsCtrl;