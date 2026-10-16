
// validators/patientValidator.js

const { body } = require("express-validator");

const createPatientValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Patient name is required")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("age")
        .notEmpty()
        .withMessage("Age is required")
        .isInt({ min: 1, max: 120 })
        .withMessage("Age must be between 1 and 120"),

    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["Male", "Female", "Other"])
        .withMessage("Gender must be Male, Female, or Other"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must contain exactly 10 digits"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ max: 255 })
        .withMessage("Address cannot exceed 255 characters")
];

module.exports = { createPatientValidator };
