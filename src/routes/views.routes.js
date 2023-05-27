const {Router} = require('express');
const DATA = require('../dao/factory.js');
const mongoose = require('mongoose')

const {ProductManager} = DATA;
const productManager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  res.render("products", { title: "Productos", style: '/css/products.css'});
});

router.get('/product/:pid', async (req, res) => {
  const pid = req.params.pid;
  if (!pid || typeof pid !== 'string' || pid.length !== 24) {
    return res.status(400).send('Invalid product ID');
  }

  try {
    const objectPid = mongoose.Types.ObjectId(pid);
    const product = await productManager.findById(objectPid);
    res.render('product', { title: 'Detalle del producto', style: '/css/products.css', product });
  } catch (error) {
    res.status(500).send('Error retrieving product', error);
  }
})

router.get("/cart", async (req, res) => {
  res.render("carts", { title: "Carrito" });
});

module.exports = router;