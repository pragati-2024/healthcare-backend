const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
    registerValidator,
    loginValidator
} = require("../validators/authValidator");

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validateRequest,
    registerUser
);

router.post(
    "/login",
    loginValidator,
    validateRequest,
    loginUser
);

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = router;