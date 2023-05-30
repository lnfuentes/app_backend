const DATA = require('../dao/factory.js');

const {CartManager} = DATA;
const cartManager = new CartManager();

const redirectByRole = async (req, res) => {
    if (req.user.role === 'admin') {
        return res.redirect('/api/products/admin');
    } else if(req.user.role === 'user') {
        try {
            let cart = await cartManager.findByUserId(req.user._id);
            if (!cart) {
                cart = await cartManager.create({ userId: req.user._id, products: [] });
            }
            req.session.cartId = cart._id;
            return res.redirect('/');
          } catch (error) {
            console.error(error);
          }
    } else {
        return res.redirect('/users/login')
    }
}

const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.status(403).redirect('/users/login');
}

module.exports = {redirectByRole, isAuthenticated};