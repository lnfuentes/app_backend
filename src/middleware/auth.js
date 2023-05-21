const redirectByRole = (req, res) => {
    if (req.user.role === 'admin') {
        return res.redirect('/api/products');
    } else if(req.user.role === 'user') {
        return res.redirect('/views/products');
    } else {
        return res.redirect('/users/login')
    }
}

module.exports = redirectByRole;