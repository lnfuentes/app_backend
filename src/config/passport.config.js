const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2');
const userModel = require('../dao/models/users.js');
const {isValidPassword} = require('../utils.js');
const dotenv = require('dotenv');

dotenv.config();

const initializePassport = () => {

    passport.use('login', new LocalStrategy({
        usernameField: 'username'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username});
            if(!user) {
                return done(null, false, {message: 'Usuario no encontrado'})
            } else {
                const match = isValidPassword(password, user.password);
                if(match) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Contraseña incorrecta'});
                }
            }
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/users/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile);
            const user = await userModel.findOne({email: profile._json.email});
            if(!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password:''
                }
                const user = await userModel.create(newUser);
                done(null, user);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }))
}

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
});

module.exports = {
    initializePassport
}