// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const passport = require('passport');

const authController = {
    /**
     * Handle user login and JWT token generation
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    token: (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).send({ message: info.message || 'Login failed' });
            }

            req.login(user, { session: false }, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }

                const expiresIn = Math.floor(Date.now() / 1000);
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn });

                return res.json({ token, expiresIn, userId: user.id, username: user.username, role: user.role });
            });
        })(req, res, next);
    }
};

module.exports = authController;
