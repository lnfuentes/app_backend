let DB_TYPE = process.argv[2] || 'MONGO';
let ENVIROMENT = process.argv[3] || 'DEV';

module.exports = {DB_TYPE, ENVIROMENT};