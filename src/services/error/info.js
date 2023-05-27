const generateProductsErrorInfo = (product) =>{
    let result = `One or more properties were incomplete or not valid.
    List of required properties:
    title: need to be a string, received --> ${product.title?product.title:"empty field"}
    description: need to be a string, received --> ${product.description?product.description:"empty field"}
    code: need to be a string, received --> ${product.code?product.code:"empty field"}
    price: need to be a number, received --> ${product.price?product.price:"empty field"}
    thumbnail: need to be a array, received --> ${product.thumbnai?product.thumbnail:"empty field"}
    stock: need to be a number, received --> ${product.stock?product.stock:"empty field"}
    category: need to be a string, received --> ${product.category?product.category:"empty field"}
    status: need to be a boolean, received --> ${product.status?product.status:"empty field"} `
    return result
}

module.exports = generateProductsErrorInfo;