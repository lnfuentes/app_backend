const bcrypt = require('bcrypt');
const {faker} = require('@faker-js/faker');

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user);

faker.locale = 'es';

const generateProduct = () => {
    return{
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.datatype.uuid(),
        price: parseInt(faker.commerce.price(0,1500)),
        thumbnail:[],
        stock: faker.datatype.number({max:2000}),
        category: faker.commerce.productAdjective(),
        status:true
    }
};

module.exports = {createHash, isValidPassword, generateProduct};