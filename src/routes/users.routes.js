const {Router} = require('express');
const redirectByRole = require('../middleware/auth.js')

const router = Router();

const {renderSignupForm, renderLoginForm, signup, gitHub, gitHubCallback, login, logout} = require('../controllers/users.controllers.js');

router.get('/signup', renderSignupForm);

router.post('/signup', signup);

router.get('/github', gitHub);

router.get('/githubcallback', gitHubCallback);

router.get('/login', renderLoginForm);

router.post('/login', redirectByRole('admin'), login);

router.get('/logout', logout);

module.exports = router;