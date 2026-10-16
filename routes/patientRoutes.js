const express = require("express");

const {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require("../controllers/patientController");
const validateRequest = require("../middleware/validateRequest");
const {
    createPatientValidator
} = require("../validators/patientValidator");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getPatients);

router.get("/:id", protect, getPatientById);

router.put(
    "/:id",
    protect,
    createPatientValidator,
    validateRequest,
    updatePatient
);

router.delete("/:id", protect, deletePatient);

router.post(
    "/",
    protect,
    createPatientValidator,
    validateRequest,
    createPatient
);
module.exports = router;