// Setup validator
const joi = require('@hapi/joi');

// Register validation
const registerValidation = user => {
    const JoiSchema = joi.object({
        username: joi.string().trim().required().max(64).messages({
            'string.empty': 'Username is required.',
            'string.max': 'Username exceeds maximum length of 64 characters.'
        }),
        email: joi.string().trim().required().insensitive().min(3).max(255).email().messages({
            'string.empty': 'Email is required.',
            'string.min': 'Email must be at least 3 characters long.',
            'string.max': 'Email exceeds maximum length of 255 characters.',
            'string.email': 'Email must be valid.'
        }),
        password: joi.string().required().min(8).messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 8 characters long.'
        }),
        confirmPassword: joi.any().equal(joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match.'
        })
    });
    return JoiSchema.validate(user);
}

// Login validation
const loginValidation = user => {
    const JoiSchema = joi.object({
        email: joi.string().trim().required().insensitive().email(),
        password: joi.string().required()
    });
    return JoiSchema.validate(user);
}

// Status validation
const statusValidation = status => {
    const JoiSchema = joi.object({
        message: joi.string().trim().required().max(255)
    });
    return JoiSchema.validate(status);
}

// Export validations
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.statusValidation = statusValidation;