const {Router} = require('express');
const {isAuthenticated} = require('../middleware/auth.js');

const {getUsers, renderUserPage, deleteInactiveUsers, updateRole} = require('../controllers/users.controllers.js');

const router = Router();

router.get('/admin', isAuthenticated, renderUserPage)

router.get('/', isAuthenticated, getUsers);

router.delete('/', isAuthenticated, deleteInactiveUsers);

router.put('/', isAuthenticated, updateRole);

module.exports = router;