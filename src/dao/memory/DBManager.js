class CartManager {
    constructor() {
      this.carts = [];
    }
  
    read(cart) {
      if (cart === undefined) {
        return this.carts;
      }
      return this.carts.slice(0, cart);
    }
  
    getCartById(cartId) {
      return this.carts.find((cart) => cart._id === cartId);
    }

    findByUserId(userId) {
      return this.carts.find((cart) => cart.userId === userId);
    }
  
    create() {
      const newCart = {
        _id: generateUniqueId(),
        products: [],
      };
      this.carts.push(newCart);
      return newCart;
    }
  
    delete(cartId) {
      const index = this.carts.findIndex((cart) => cart._id === cartId);
      if (index !== -1) {
        return this.carts.splice(index, 1)[0];
      }
      return null;
    }
  
    deleteCartProduct(cartId, productId) {
      const cart = this.getCartById(cartId);
      if (cart) {
        const index = cart.products.findIndex((product) => product._id === productId);
        if (index !== -1) {
          return cart.products.splice(index, 1)[0];
        }
      }
      return null;
    }
  
    deleteAllProducts(cartId) {
      const cart = this.getCartById(cartId);
      if (cart) {
        cart.products = [];
        return cart;
      }
      return null;
    }
  
    updateCart(cartId, products) {
      const cart = this.getCartById(cartId);
      if (cart) {
        cart.products = products;
        return cart;
      }
      return null;
    }
  
    updateCartProd(cartId, productId) {
      const cart = this.getCartById(cartId);
      if (cart) {
        const existingProduct = cart.products.find((product) => product.product === productId);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }
        return cart;
      }
      return null;
    }
  
    updateProductQuantity(cartId, productId, quantity) {
      const cart = this.getCartById(cartId);
      if (cart) {
        const product = cart.products.find((p) => p.product === productId);
        if (product) {
          product.quantity = quantity;
          return cart;
        }
      }
      return null;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
    }

    read() {
        return this.products;
    }

    create(prod) {
        const newProduct = { ...prod, _id: generateUniqueId() };
        this.products.push(newProduct);
        return newProduct;
    }

    delete(productId) {
        const index = this.products.findIndex((product) => product._id === productId);
        if (index !== -1) {
        return this.products.splice(index, 1)[0];
        }
        return null;
    }

    update(productId, updatedProduct) {
        const product = this.products.find((p) => p._id === productId);
        if (product) {
        Object.assign(product, updatedProduct);
        return product;
        }
        return null;
    }

    findById(pid) {
      const product = this.products.find(p => p._id === pid);
      return product;
    }
}

class UserManager {
  constructor() {
    this.users = []; 
  }

  create(user) {
    const newUser = { ...user, id: generateUniqueId() };
    this.users.push(newUser);
    return newUser;
  }

  findOne(user) {
    const foundUser = this.users.find((u) => u.username === user.username); 
    return foundUser;
  }

  findById(id) {
    const foundUser = this.users.find((u) => u.id === id);
    return foundUser;
  }

  findByIdAndUpdate(id, update) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      const updatedUser = { ...this.users[userIndex], ...update };
      this.users[userIndex] = updatedUser;
      return updatedUser;
    }
    return null;
  }

  deleteMany(filter) {
    const deletedUsers = this.users.filter((user) => !filter(user));
    this.users = deletedUsers;
    return deletedUsers.length;
  }
}

class TicketManager {
  constructor() {
    this.tickets = [];
  }

  getTickets() {
    return this.tickets;
  }

  getTicketId(id) {
    const ticket = this.tickets.find(ticket => ticket.id === id);
    return ticket;
  }

  createTicket(ticket) {
    const newTicket = { id: generateUniqueId(), ...ticket };
    this.tickets.push(newTicket);
    return newTicket;
  }
}

function generateUniqueId() {
return Math.random().toString(36).substring(2);
}

module.exports = { CartManager, ProductManager, UserManager, TicketManager };