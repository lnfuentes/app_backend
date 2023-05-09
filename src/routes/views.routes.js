const {Router} = require('express');

const router = Router();

router.get("/products", async (req, res) => {
  res.render("products", { title: "Productos" });
});

router.get("/cart", async (req, res) => {
  res.render("carts", { title: "Carrito" });
});

module.exports = router;