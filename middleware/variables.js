module.exports = function (req, res, next){
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    if (req.session.user){
        res.locals.username = `${req.session.user.firstName} ${req.session.user.lastName}`
    }
    next()
}