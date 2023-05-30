const elementExist = id => document.getElementById(id) !== null;

function getCurrentURL() {
    return window.location.href;
}
  
function getParameters(currentURL) {
    const myParams = {};
    let urlString = currentURL;
    let paramString = urlString.split("?")[1];
    let queryString = new URLSearchParams(paramString);
    for (let pair of queryString.entries()) {
      myParams[pair[0]] = pair[1];
    }
    return myParams;
}

const convertParamsToQuery = (params) => {
    let query = "";
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        query += `${key}=${value}&`;
      }
    }
    return query;
};

const fetchProducts = async () => {
  const url = getCurrentURL()
  const params = getParameters(url);
  const query = convertParamsToQuery(params)
  const response = await fetch(`http://localhost:8080/api/products?${query}`);
  const data = await response.json();
  const myElement = document.getElementById("contenidoProductos");
  myElement.innerHTML = data.result.payload.map((product) => {
    if(product.stock === 0){
      return `
              <div class="card col-3 gap">
                <img src="${product.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">${product.price}</p>
                  <p class="card-text">¡Producto sin stock!</p>
                </div>
              </div>
              `;
    } else {
      return `
              <div class="card col-3 gap">
                <img src="${product.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">${product.price}</p>
                  <p class="card-text">${product.stock}</p>
                  <a href="/product/${product._id}" class="btn btn-primary">Detalles</a>
                </div>
              </div>
              `;
    }
  }).join('');
}  

elementExist('contenidoProductos') && fetchProducts();

const fetchCart = async () => {
  const response = await fetch(`http://localhost:8080/cart`);
  const data = await response.json();
  const myElement = document.getElementById("contenidoCarrito");
  data[0].products.forEach(p => {
    return myElement.innerHTML = `
      <div>
        <p>${p.product.title}</p>
        <p>${p.quantity}</p>
      </div>
  `
  })
}

elementExist('contenido carrito') && fetchCart();

const addToCartLink = document.getElementById('add-to-cart');
console.log(addToCartLink);
addToCartLink.addEventListener('click', e => {
  e.preventDefault();
  const cid = addToCartLink.dataset.cid;
  const pid = addToCartLink.dataset.pid;
  addToCart(cid, pid);
});

const addToCart = (cartId, productId) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  fetch(`/api/carts/${cartId}/${productId}`, options)
    .then(response => {
      if (response.ok) {
        console.log('Producto agregado al carrito');
      }
    })
    .catch(error => {
      console.error('Error de red:', error);
    });
}
