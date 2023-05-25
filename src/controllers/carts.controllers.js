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
        res.status(500).send(error.message);
    }
}

cartsCtrl.getCartId = async (req, res) => {
    const cartId = await cartManager.getCartById(req.params.cid);
    res.status(200).send(cartId);
}

cartsCtrl.createCart = async (req, res) => {
    try {
        const result = await cartManager.create();
        res.status(200).send({message: 'Carrito creado', result});
    } catch (error) {
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
          res.status(500).send('Product not found');
        } else {
            if(product.stock > 0) {
                const result = await cartManager.updateCartProd(cid, pid);
                await productManager.updateField(pid, 'stock', newStock)
                res.send({message: "Carrito actualizado", result});
            } else {
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
        res.status(200).send({message: 'Carrito eliminado', result});
    } catch(error) {
        res.status(500).send(error.message);
    }
}

cartsCtrl.deleteCartProduct = async (req, res) => {
    try{
        const {cid} = req.params;
        const {pid} = req.params;
        const result = await cartManager.deleteCartProduct(cid, pid);
        res.status(200).send({message: 'Producto eliminado', result});
    } catch(error) {
        res.status(500).send(error.message);
    }
}

cartsCtrl.deleteAllProducts = async (req, res) => {
    try {
        const {cid} = req.params;
        const result = await cartManager.deleteAllProducts(cid);
        res.status(200).send({message: 'Carrito vaciado', result});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

cartsCtrl.updateCart = async (req, res) => {
    const {cid} = req.params;
    const newProduct = req.body;
    try {
        const result = await cartManager.updateCart(cid, newProduct);
        res.status(200).send({message: 'Carrito actualizado', result});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

cartsCtrl.updateProductQuantity = async (req, res) => {
    try {
        const {cid} = req.params;
        const {pid} = req.params;
        const quantity = req.body;
        const result = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).send({message: 'Cantidad del producto actualizada', result})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = cartsCtrl;