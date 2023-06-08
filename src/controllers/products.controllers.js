const productModel = require('../dao/models/product.js');
const DATA = require('../dao/factory.js');
const CustomError = require('../services/error/customError.js');
const EErrors = require('../services/error/enum.js');
const generateProductsErrorInfo = require('../services/error/info.js');
const productsCtrl = {};

const {ProductManager} = DATA;
const productManager = new ProductManager();

productsCtrl.renderProductsForm = async (req, res) => {
    if(req.user.role === 'admin') {
        res.render('admin', {title: 'Admin Page', style: '/css/admin.css'});
    } else {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al renderizar el formulario de productos`);
        res.status(403).redirect('/users/login');
    }
}

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
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al obtener los productos`);
        res.status(500).send(error.message);        
    }
}

productsCtrl.createProduct = async (req, res, next) => {
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body;

        if(!title || !description || !code || !price || !thumbnail || !category) {
            // res.status(400).send({error: 'Faltan Datos'});
            CustomError.createError({
                name:"Product creation error",
                cause: generateProductsErrorInfo({title,description,code,price,thumbnail,stock,category}),
                message: "Error trying to create Product",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        const result = await productManager.create({title, description, code, price, thumbnail, stock, category});
        if(result) {
            req.flash('success_msg', 'Producto creado correctamente');
        }
        res.status(200).send({message: 'producto creado correctamente'})
        // res.status(201).redirect('/api/products/admin');
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al crear el producto`);
        next(error);
    }
}

productsCtrl.deleteProduct = async (req, res) => {
    const id = req.body.id;
    id === undefined ? res.status(400).send({error: 'faltan datos'}) : null;
    try {
        const result = await productManager.delete(id);
        if(result) {
            req.flash('success_msg', 'Producto eliminado correctamente');
        }
        res.status(200).send({message: 'producto eliminado correctamente'})
        // res.status(200).redirect('/api/products/admin');
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al eliminar el producto`);
        res.status(500).send(error.message);
    }
}

productsCtrl.updateProduct = async (req, res) => {
    try {
        const {id, title, description, code, price, thumbnail, stock, category} = req.body;
        
        if(!id || !title || !description || !code || !price || !thumbnail || !stock || !category) {
            res.status(400).send({error: 'Faltan Datos'});
            return;
        }
        
        const result = await productManager.update(id, {title, description, code, price, thumbnail, stock, category});
        if(result) {
            req.flash('success_msg', 'Producto actualizado correctamente');
        }
        res.status(200).send({message: 'producto actualizado correctamente'})
        // res.status(200).redirect('/api/products/admin');
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al actualizar el producto`);
        throw new Error(error.message);
    }
}

module.exports = productsCtrl;