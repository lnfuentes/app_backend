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
const {initializePassport} = require('./config/passport.config.js')
const productRouter = require('./routes/products.routes.js');
const cartRouter = require('./routes/carts.routes.js');
const viewsRouter = require('./routes/views.routes.js');
const usersRouter = require('./routes/users.routes.js');

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
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'SecretCode',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session())
app.use(flash());

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
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/views', viewsRouter);
app.use('/users', usersRouter);