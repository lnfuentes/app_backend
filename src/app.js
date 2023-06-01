const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const {engine} = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const compression = require('express-compression');
const methodOverride = require('method-override');
const {initializePassport} = require('./config/passport.config.js')
const addLogger = require('./config/logger.js');
const errorHandler = require('./middleware/errors/index.js');
const productRouter = require('./routes/products.routes.js');
const cartRouter = require('./routes/carts.routes.js');
const viewsRouter = require('./routes/views.routes.js');
const usersRouter = require('./routes/users.routes.js');
const ticketRouter = require('./routes/tickets.routes.js');
const mockingRouter = require('./routes/mockingProducts.routes.js');
const loggerTestRouter = require('./routes/logger.routes.js');

// SETTINGS
dotenv.config();
const app = express();
const {SERV_PORT, USER_MONGO, PASS_MONGO, DB_MONGO} = process.env;
const stringCollection =`mongodb+srv://${USER_MONGO}:${PASS_MONGO}@coder-cluster.ncl2vhs.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority`;
initializePassport();


app.set('view engine', 'ejs');
app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(compression({
    brotli: {enable: true, zlib: {}}
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'SecretCode',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session())
app.use(flash());
app.use(methodOverride('_method'));
app.use(addLogger);

// STATICS FILES
app.use(express.static('public'));

// SERVER 
const server = app.listen(SERV_PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${SERV_PORT}`)
});

server.on('error', error => console.log(`Error en el servidor: ${error}`));

// MONGO DB
const environment = async () => {
    try {
        await mongoose.connect(stringCollection, error => {
            console.log("Conectado a la base de datos");
        })
    } catch (error) {
        console.log(`Error en la conexion de la base de datos ${error}`)
    }
}

const okStartData = () => {
    if(USER_MONGO && PASS_MONGO) return true;
    else return false;
}
okStartData() && environment();


// GLOBAL VARIABLES 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// ROUTES
app.use(viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/users', usersRouter);
app.use('/tickets', ticketRouter);
app.use('/mockingProducts', mockingRouter);
app.use('/loggerTest', loggerTestRouter);
app.use(errorHandler);