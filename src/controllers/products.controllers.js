const productModel = require('../dao/models/product.js');
const DATA = require('../dao/factory.js');
const productsCtrl = {};

const {ProductManager} = DATA;
const productManager = new ProductManager();

productsCtrl.getProducts = async (req, res) => {
    const stock = req.query.stock;
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || 1;
    let query;
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const category = req.query.category;
    let prevUrl;
    let nextUrl;

    if (category != undefined || stock != undefined) {
        if (category != undefined) {
            query = {category: category};
        } else {
            query = {stock: stock};
        }
    } else {
        if (category != undefined && stock != undefined) {
            query = {category: category, stock: stock}
        } else{
            query = {};
        }
    }

    try {
        const result = await productModel.paginate(
            query,
            {
                page: page || 1,
                limit: limit,
                sort: {price: sort}
            },
            (err, res) => {
                res.hasPrevPage
                ? (prevUrl = url.replace(`page=${res.page}`, `page=${res.prevPage}`)) : null;
                res.hasNextPage
                ? (nextUrl = page === undefined ? url.concat(`&page=${res.nextPage}`) : url.replace(`page=${res.page}`, `page=${res.nextPage}`)) : null;
                return {
                    status: res.docs.length != 0 ? "success" : "error",
                    payload: res.docs,
                    totalPages: res.totalPages,
                    prevPage: res.prevPage,
                    nextPage: res.nextPage,
                    page: res.page,
                    hasPrevPage: res.hasPrevPage,
                    hasNextPage: res.hasNextPage,
                    prevLink: prevUrl,
                    nextLink: nextUrl,
                }
            }
        );

        res.status(200).send({message: 'Productos', result})
    } catch (error) {
        res.status(500).send(error.message);        
    }
}

productsCtrl.createProduct = async (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnail} = req.body;
    if(!title || !description || !code || !price || !thumbnail || !stock || !category || !status) {
        res.status(400).send({error: 'Faltan Datos'});
        return;
    }

    try {
        const result = await productManager.create({title, description, code, price, thumbnail, stock, status, category});
        res.status(200).send({message: "Producto Creado", result});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

productsCtrl.deleteProduct = async (req, res) => {
    const {id} = req.params;
    id === undefined ? res.status(400).send({error: 'faltan datos'}) : null;
    try {
        const result = await productManager.delete(id);
        res.status(200).send({message: 'Producto eliminado', result});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

productsCtrl.updateProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const {title, description, code, price, thumbnail, stock, status, category} = req.body;
        
        if(!title || !description || !code || !price || !thumbnail || !stock || !category || !status) {
            res.status(400).send({error: 'Faltan Datos'});
            return;
        }
        
        const result = await productManager.findByIdAndUpdate(id, {title, description, code, price, thumbnail, stock, status, category});
        res.status(200).send({message: 'Producto actualizado', result});
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = productsCtrl;