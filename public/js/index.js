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
              <div class="card col-3 gap product">
                <img src="${product.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h4 class="card-title">${product.title}</h4>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text price">$${product.price}</p>
                  <p class="card-text">¡Producto sin stock!</p>
                </div>
              </div>
              `;
    } else {
      return `
              <div class="card col-3 gap product">
                <img src="${product.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h4 class="card-title">${product.title}</h4>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text price">$${product.price}</p>
                  <p class="card-text">${product.stock}</p>
                  <a href="/product/${product._id}" class="btn-detail">Detalles</a>
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

elementExist('contenidoCarrito') && fetchCart();

const addToCartLink = document.getElementById('add-to-cart');
if(addToCartLink) {
  addToCartLink.addEventListener('click', e => {
    e.preventDefault();
    const cid = addToCartLink.dataset.cid;
    const pid = addToCartLink.dataset.pid;
    addToCart(cid, pid);
  });
}

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
        Swal.fire(
          'Producto añadido!',
          'success'
        )
      }
    })
    .catch(error => {
      console.error('Error de red:', error);
    });
}

const fetchUsersBtn = document.getElementById('fetch-users');
const usersDiv = document.getElementById('users');
if(fetchUsersBtn) {
  fetchUsersBtn.addEventListener('click', async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/');
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const data = await response.json();

      
      data.result.forEach(user => {
        const card = `
                        <div class="card col-3 user">
                          <div class="card-body">
                              <p class="card-title"><span>Nombre:</span> ${user.first_name} ${user.last_name}</p>
                              <p class="card-text"><span>Correo:</span> ${user.email}</p>
                              <p class="card-text"><span>Rol:</span> ${user.role}</p>
                          </div>
                        </div>
                    `;
        usersDiv.innerHTML += card;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
}