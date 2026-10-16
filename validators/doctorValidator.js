
// validators/doctorValidator.js

const { body } = require("express-validator");

const createDoctorValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Doctor name is required")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("specialization")
        .trim()
        .notEmpty()
        .withMessage("Specialization is required")
        .isLength({ max: 100 })
        .withMessage("Specialization cannot exceed 100 characters"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must contain exactly 10 digits"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail()
];

module.exports = { createDoctorValidator };
