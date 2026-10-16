
const express = require("express");
const router = express.Router();

const {
    createMapping,
    getMappings,
    getPatientMappings,
    deleteMapping
} = require("../controllers/mappingController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a patient-doctor mapping

router.post("/", authMiddleware, createMapping);

// Get all mappings
router.get("/", authMiddleware, getMappings);

// Get mappings for a specific patient
router.get(
    "/patient/:patientId",
    authMiddleware,
    getPatientMappings
);

// Delete a mapping
router.delete("/:id", authMiddleware, deleteMapping);

module.exports = router;
