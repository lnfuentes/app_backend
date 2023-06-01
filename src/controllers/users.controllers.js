const DATA = require('../dao/factory.js');
const {createHash} = require('../utils.js');
const passport = require('passport');
const {redirectByRole} = require('../middleware/auth.js');
const transporter = require('../config/mailer.js');
const usersCtrl = {};

const {UserManager} = DATA;
const userManager = new UserManager();

usersCtrl.renderSignupForm = (req, res) => {
    res.render('signup', {title: 'Registro', style: '/css/signup.css'});
}

usersCtrl.signup = async (req, res) => {
    try {
        let errors = [];
        const {first_name, last_name, email, age, password} = req.body;
        const userEmail = await userManager.findOne({email: email});
        
        if(!first_name || !last_name || !email || !age || !password) {
            errors.push({message: 'Todos los campos son obligatorios'});
        } else if (userEmail) {
            errors.push({message: 'El mail ya está en uso'});
        } else if (password.length < 4) {
            errors.push({message: 'Contraseña demasiado corta. (min. 4 caracteres)'});
        }
    
        if(errors.length > 0) {
            res.render('signup', {title: 'Registro', style: '/css/signup.css', errors, first_name, last_name, email, age});
        } else {
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                role: 'user',
                password: createHash(password)
            }
            await userManager.create(newUser);

            let info = await transporter.sendMail({
                from: '"Usuario registrado" <app-backend@gmail.com>', // sender address
                to: newUser.email, // list of receivers
                subject: `Bienvenido ${newUser.first_name}`, // Subject line
                html: "<b>Bienvenido a la aplicacion backend</b>", // html body
            });

            req.flash('success_msg', 'Usuario registrado correctamente');
            res.status(201).redirect('/users/login');
        }
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al crear el usuario`);
        res.status(500).send(error.message);
    }
}

usersCtrl.gitHub = passport.authenticate('github', {scope:['user: email']});

usersCtrl.gitHubCallback = passport.authenticate('github', {failureRedirect: 'signup', successRedirect: '/'})

usersCtrl.renderLoginForm = (req, res) => {
    res.render('login', {title: 'Iniciar Sesion', style: '/css/login.css'});
}

usersCtrl.login = (req, res) => {
    passport.authenticate('login', { failureRedirect: 'login', failureFlash: true })(req, res, () => {
        redirectByRole(req, res);
    });
} 

usersCtrl.logout = (req, res, next) => {
    try {
        req.logout(function(err) {
            if(err) return next(err);
            req.flash('success_msg', 'Sesión Cerrada');
            res.status(200).redirect('/users/login');
        });
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al cerrar sesión`);
        res.status(500).send(error.message);
    }
}

module.exports = usersCtrl;