const cartModel = require('../models/cart.js');
const productModel = require('../models/product.js');
const ticketModel = require('../models/ticket.js');
const userModel = require('../models/users.js');

class CartManager {
    async read(cart) {
        try {
            if(cart === undefined) {
                const carts = await cartModel.find();
                return carts;
            }
            return cartModel.find().limit(cart);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCartById(cartId) {
        return await cartModel.find({_id: cartId});
    }

    async findByUserId(userId) {
        return await cartModel.findOne({userId: userId});
    }

    async create(cart) {
        try{
            const newCart = await cartModel.create(cart);
            return newCart;
        } catch(error) {
            throw new Error(error);
        }
    }

    async delete(cartId) {
        try{
            const result = await cartModel.findByIdAndDelete(cartId);
            return result;
        } catch(error) {
            throw new Error(error);
        }
    }

    async deleteCartProduct(cid, pid) {
        try {
            let i;
            const cart = await cartModel.find({_id: cid});
            const Nproducts = cart[0].products;
            Nproducts.forEach((p, index) => {
                if(pid == p._id.valueOf()) {
                    i = index;
                }
            });
            if(!isNaN(i)) {
                Nproducts.splice(i, 1);
                const result = await cartModel.findByIdAndUpdate(cid, {products: Nproducts});
                return result;
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAllProducts(cid) {
        const result = await cartModel.findByIdAndUpdate(cid, {products: []});
        return result;
    }

    async updateCart(cid, products) {
        const result = await cartModel.find({ _id: cid }).updateMany({ products: products });
        return result;
      }

    async updateCartProd(cartId, productId) {
        let i;
        const cart = await cartModel.find({_id: cartId});
        const newProduct = {product: productId, quantity: 1};
        const Nproducts = cart[0].products;
        
        Nproducts.forEach((p, index) => {
            if(productId === p.product._id.valueOf()) {
                i = index;
            }
        });

        if (!isNaN(i)) {
            Nproducts[i].quantity++;
        } else {
            Nproducts.push(newProduct);
        }

        const result = await cartModel.findByIdAndUpdate(cartId, {products: Nproducts});
        return result;
    }

    async updateProductQuantity(cid, pid, qty) {
        try {
            let i;
            const cart = await cartModel.find({_id: cid});
            const Nproducts = cart[0].products;
            Nproducts.forEach((p, index) => {
                if (pid == p._id.valueOf()) {
                    i = index;
                }
            }); 

            if(!isNaN(i)) {
                Nproducts[i].quantity = qty.quantity;
                const result = await cartModel.findByIdAndUpdate(cid, {products: Nproducts});
                return result;
            }
        } catch (error) {
            throw new Error(error);
        }
        
    }
}

class ProductManager {
    async read() {
        try {
            const products = await productModel.find();
            return products
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(prod) {
        try{
            const newProducts = new productModel(prod);
            await newProducts.save();
            return newProducts;
        } catch(error) {
            throw new Error(error);
        }
    }

    async delete(productId) {
        try{
            const result = await productModel.findByIdAndDelete(productId);
            return result;
        } catch(error) {
            throw new Error(error);
        }
    }

    async update(productId, product) {
        try {
            const result = await productModel.findByIdAndUpdate(productId, product);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateField(pid, field, value) {
        try {
            const result = await productModel.findByIdAndUpdate(pid, {[field]: value});
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async findById(pid) {
        try {
            const result = await productModel.findById(pid);
            return result
        } catch (error) {
            console.log(error)
            // throw new Error(error);
        }
    }
}

class UserManager {
    async read(filter) {
        try {
            const users = await userModel.find(filter);
            return users;
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(user) {
        try {
            const newUser = await userModel.create(user);
            return newUser;
        } catch (error) {
            throw new Error(error)
        }
    }

    async findOne(user) {
        try {
            const OneUser = await userModel.findOne(user);
            return OneUser;
        } catch (error) {
            throw new Error(error)
        }
    }

    async findById(id) {
        try {
            const userById = await userModel.findById(id);
            return userById;
        } catch (error) {
            throw new Error(error)
        }
    }

    async findByIdAndUpdate(id, updatedData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteMany(filter) {
        const result = await userModel.deleteMany(filter);
        return result;
    }
}

class TicketManager {
    async getTickets() {
        const tickets = await ticketModel.find();
        return tickets;
    }

    async getTicketId(id) {
        const ticket = await ticketModel.findById(id);
        return ticket;
    }

    async create(ticket) {
        const myTicket = await ticketModel.create(ticket);
        return myTicket;
    }
}

module.exports = {CartManager, ProductManager, UserManager, TicketManager};