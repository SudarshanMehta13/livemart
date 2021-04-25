function wholesaler (req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'wholesaler') {
        return next()
    }
    return res.redirect('/')
}

module.exports = wholesaler