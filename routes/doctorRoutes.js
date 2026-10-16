const express = require("express");

const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} = require("../controllers/doctorController");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
    createDoctorValidator
} = require("../validators/doctorValidator");
const router = express.Router();

router.get("/", protect, getDoctors);

router.get("/:id", protect, getDoctorById);

router.delete("/:id", protect, deleteDoctor);

router.post(
    "/",
    protect,
    createDoctorValidator,
    validateRequest,
    createDoctor
);

router.put(
    "/:id",
    protect,
    createDoctorValidator,
    validateRequest,
    updateDoctor
);
module.exports = router;