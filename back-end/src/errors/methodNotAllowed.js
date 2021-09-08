function methodNotAllowed(req, res, next) {
    next({
        status: 405,
        message: `${req.body} method is not allowed!`
    })
}

module.exports = methodNotAllowed;