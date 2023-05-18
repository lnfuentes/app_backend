const redirectByRole = (role) => {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            if (role === 'admin') {
                res.redirect('/');
            } 
        } else {
            next();
        }
    };
}

module.exports = redirectByRole;