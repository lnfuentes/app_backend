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
    try {
        if (res.locals.user) {
            const pid = req.params.pid;
            const cartId = req.session.cartId;
            const cid = cartId.valueOf();
            if (!pid || typeof pid !== 'string' || pid.length !== 24) {
                return res.status(400).send('Invalid product ID');
            }
            const objectPid = mongoose.Types.ObjectId(pid);
            const product = await productManager.findById(objectPid);
            req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Producto renderizado`);
            res.render('product', { title: 'Detalle del producto', style: '/css/products.css', product, cid, pid });
        } else {
            res.render('product', { title: 'Detalle del producto', style: '/css/products.css'});
        }

    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al traer el producto`);
        res.status(500).send('Error retrieving product', error);
    }
}

viewsCtrl.renderCart = async (req, res) => {
    try {
        if (res.locals.user) {
            const cartId = req.session.cartId;
            const userCart = await cartManager.getCartById(cartId);
            const cart = userCart[0];
            let products = []; 
            let total = 0;
            cart.products.forEach(p => {
                const product = {
                    thumbnail: p.product.thumbnail,
                    title: p.product.title,
                    description: p.product.description,
                    price: p.product.price * p.quantity
                } 
                total += product.price;
                products.push(product);
            });
            req.session.amount = total;
            req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Carrito renderizado`);
            res.render("cart", { title: "Carrito", style: '/css/cart.css', products, total});
        } else {
            res.render('cart', {title: 'Carrito', style: '/css/cart.css'});
        }
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al renderizar el carrito`);
        res.status(500).send('Error retrieving cart', error)
    }
}

module.exports = viewsCtrl;