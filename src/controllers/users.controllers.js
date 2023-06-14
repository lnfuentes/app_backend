const DATA = require('../dao/factory.js');
const {createHash} = require('../utils.js');
const passport = require('passport');
const {redirectByRole} = require('../middleware/auth.js');
const transporter = require('../config/mailer.js');
const moment = require('moment');
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
                from: '"APP-BACKEND" <app-backend@gmail.com>', // sender address
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

usersCtrl.renderUserPage = async (req, res) => {
    res.render('adminUsers', {title: 'Admin page', style: '/css/admin.css'})
}

usersCtrl.getUsers = async (req, res) => {
    try {
        const result = await userManager.read();
        res.status(200).send({message: 'Usuarios obtenidos correctamente', result});
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al obtener los usuarios`);
        res.status(500).send(error.message);
    }
}

usersCtrl.deleteInactiveUsers = async (req, res) => {
    try {
        const twoDaysAgo = moment().subtract(2, 'days').toDate();
        const usersToDelete = await userManager.read({last_connection: {$lt: twoDaysAgo}});
        const deletedUsers = await userManager.deleteMany({last_connection: {$lt: twoDaysAgo}});
        const deletedCount = deletedUsers.deletedCount;
        if(deletedCount > 0) {
            usersToDelete.forEach(user => {
                transporter.sendMail({
                    from: '"APP-BACKEND" <app-backend@gmail.com>', // sender address
                    to: user.email, // list of receivers
                    subject: 'Eliminación por inactividad', // Subject line
                    html: "<b>Lamentamos comunicarte que tu cuenta ha sido eliminada por inactividad.</b>", // html body
                });
            });
        }
        req.flash('success_msg', 'Usuarios inactivos eliminados correctamente');
        res.status(200).redirect('/api/users/admin');
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Usuarios inactivos eliminados`);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al eliminar los usuarios`);
        res.status(500).send(error.message);
    }
}

usersCtrl.updateRole = async (req, res) => {
    try {
        const {id, role} = req.body;
        if(!id || !role) {
            res.status(400).send({error: 'Faltan Datos'});
            return;
        }

        const result = await userManager.findByIdAndUpdate(id, {role});
        if (result) {
            req.flash('success_msg', 'Rol de usuario actualizado correctamente');
        }
        res.status(200).redirect('/api/users/admin');
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} - Error al actualizar el rol de usuario`);
        throw new Error(error.message);
    }
}

module.exports = usersCtrl;