const { validationResult } = require('express-validator');

/**
 * Validates the request using the provided validations.
 * This middleware uses the `express-validator` package.
 * It applies an array of validation functions to the request.
 * If any validation fails, it returns a 400 Bad Request response with the validation errors.
 * @function validate
 * @memberof module:middlewares/validatorMiddleware
 * @param {Array} validations - An array of validation functions.
 * @returns {Function} - The middleware function that performs the validations.
 */
const validate = validations => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            errors: errors.array()
        });
    };
};

module.exports = validate;