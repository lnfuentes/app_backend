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

const fetchContenidoProductos = async () => {
    const url = getCurrentURL()
    const params = getParameters(url);
    const query = convertParamsToQuery(params)
    const response = await fetch(`http://localhost:8080/api/products?${query}`);
    const data = await response.json();
    const myElement = document.getElementById("contenidoProductos");
    myElement.innerHTML = data.result.payload.map((product) => {
      return `
              <div class="card col-3">
                  <img src="${product.thumbnail}" class="card-img-top" alt="...">
                  <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">${product.price}</p>
                  <a href="#" id=${product._id} class="btn btn-primary">Añadir</a>
                  </div>
              </div>
              `;
    });

    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
        e.preventDefault();
        const id = e.target.id;
        console.log(id);
        window.location.href = `/product/${id}`;
        });
    });
}  

elementExist('contenidoProductos') && fetchContenidoProductos();

const fetchProducto = async () => {
    const url = getCurrentURL();
    const params = getParameters(url);
    const query = convertParamsToQuery(params);
    const response = await fetch(`http://localhost:8080/api/product?${query}`);
    const data = await response.json();
    const myElement = document.getElementById("contenidoProductos");
};