const DATA = require('../dao/factory.js');
const cartsCtrl = {};

const {CartManager, ProductManager} = DATA;
const cartManager = new CartManager();
const productManager = new ProductManager();

cartsCtrl.getCarts = async (req, res) => {
    try {
        const limit = req.query.limit;
        const result = await cartManager.read(limit);
        res.send(result);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al obtener los carritos`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.getCartId = async (req, res) => {
    try{
        const cartId = await cartManager.getCartById(req.params.cid);
        res.status(200).send(cartId);
    } catch(error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al obtener el carrito`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.createCart = async (req, res) => {
    try {
        const result = await cartManager.create();
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Carrito creato`);
        res.status(200).send({message: 'Carrito creado', result});
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al crear el carrito`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.addProductCart = async (req, res) => {
    try {
      const {cid} = req.params;
      const {pid} = req.params;
      const product = await productManager.findById(pid);
      let currentStock = product.stock;
      const newStock = currentStock -1;
      if(!product) {
          req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Producto no encontrado`);
          res.status(500).send('Product not found');
        } else {
            if(product.stock > 0) {
                const result = await cartManager.updateCartProd(cid, pid);
                await productManager.updateField(pid, 'stock', newStock);
                req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Producto agregado al carrito`);
                res.send({message: "Carrito actualizado", result});
            } else {
                req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al agregar el producto al carrito`);
                res.status(500).send('Insufficient stock');
            }
      }
    } catch (err) {
        const error = err.message;
        res.status(500).send("Cart not found: " + error);
    }
}

cartsCtrl.deleteCart = async (req, res) => {
    const {cid} = req.params;
    try{
        const result = await cartManager.delete(cid);
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Carrito eliminado`);
        res.status(200).send({message: 'Carrito eliminado', result});
    } catch(error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al eliminar el carrito`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.deleteCartProduct = async (req, res) => {
    try{
        const {cid} = req.params;
        const {pid} = req.params;
        const result = await cartManager.deleteCartProduct(cid, pid);
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Producto eliminado`);
        res.status(200).send({message: 'Producto eliminado', result});
    } catch(error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al eliminar el producto del carrito`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.deleteAllProducts = async (req, res) => {
    try {
        const {cid} = req.params;
        const result = await cartManager.deleteAllProducts(cid);
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Carrito vaciado correctamente`);
        res.status(200).send({message: 'Carrito vaciado', result});
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al vaciar el carrito`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.updateCart = async (req, res) => {
    const {cid} = req.params;
    const newProduct = req.body;
    try {
        const result = await cartManager.updateCart(cid, newProduct);
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Carrito actualizado correctamente`);
        res.status(200).send({message: 'Carrito actualizado', result});
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al actualizar el carrito`);
        res.status(500).send(error.message);
    }
}

cartsCtrl.updateProductQuantity = async (req, res) => {
    try {
        const {cid} = req.params;
        const {pid} = req.params;
        const quantity = req.body;
        const result = await cartManager.updateProductQuantity(cid, pid, quantity);
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Cantidad actualizada correctamente`);
        res.status(200).send({message: 'Cantidad del producto actualizada', result})
    } catch (error) {
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al actualizar la cantidad`);
        res.status(500).send(error.message);
    }
}

module.exports = cartsCtrl;