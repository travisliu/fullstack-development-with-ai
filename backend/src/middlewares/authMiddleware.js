// src/middlewares/authMiddleware.js
const passport = require('passport');

/**
 * Middleware function for authenticating requests using JWT.
 * @function authenticate
 * @memberof module:middlewares/authMiddleware
 * @instance
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const authenticate = passport.authenticate('jwt', { session: false });

/**
 * Middleware function to authorize user roles.
 * @function authorize
 * @memberof module:middlewares/authMiddleware
 * @instance
 * @param {Array} roles - The roles allowed to access the route.
 * @returns {Function} - The middleware function.
 */
const authorize = roles => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).send({ message: "Access Denied: You don't have the required permission." });
        }
    };
};

module.exports = {
    authenticate,
    authorize
};
