const checkIsInRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.redirect('/users/team')
    }

    const hasRole = roles.find(role => req.user.role === role)
    if (!hasRole) {
        return res.redirect('/users/team')
    }

    return next()
}

module.exports = checkIsInRole;
