const DATA = require('../dao/factory.js');

const {CartManager, UserManager} = DATA;
const cartManager = new CartManager();
const userManager = new UserManager()

const redirectByRole = async (req, res) => {
    if (req.user.role === 'admin') {
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Rol admin autorizado`);
        return res.redirect('/api/products/admin');
    } else if(req.user.role === 'user') {
        try {
            let cart = await cartManager.findByUserId(req.user._id);
            if (!cart) {
                cart = await cartManager.create({ userId: req.user._id, products: [] });
            }
            req.session.cartId = cart._id;
            await userManager.findByIdAndUpdate({_id: req.user._id.valueOf()}, {last_connection: new Date()});
            return res.redirect('/');
        } catch (error) {
            req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Problemas con el rol usuario`);
        }
    } else {
        req.logger.warning(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Rol no autorizado`);
        return res.redirect('/users/login')
    }
}

const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.logger.warning(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Usuario sin autenticar`);
    res.status(403).redirect('/users/login');
}

module.exports = {redirectByRole, isAuthenticated};