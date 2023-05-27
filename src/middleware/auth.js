const redirectByRole = (req, res) => {
    if (req.user.role === 'admin') {
        return res.redirect('/api/products');
    } else if(req.user.role === 'user') {
        return res.redirect('/');
    } else {
        return res.redirect('/users/login')
    }
}

module.exports = redirectByRole;