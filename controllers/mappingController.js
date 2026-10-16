const PatientDoctor = require("../models/PatientDoctor");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Create Mapping
const createMapping = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        if (!patientId || !doctorId) {
            return res.status(400).json({
                message: "patientId and doctorId are required"
            });
        }

        // Check whether patient belongs to logged-in user
        const patient = await Patient.findOne({
            where: {
                id: patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // Check whether doctor exists
        const doctor = await Doctor.findByPk(doctorId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Prevent duplicate mappings
        const existingMapping = await PatientDoctor.findOne({
            where: {
                patientId,
                doctorId
            }
        });

        if (existingMapping) {
            return res.status(400).json({
                message: "Patient is already mapped to this doctor"
            });
        }

        // Create mapping
        const mapping = await PatientDoctor.create({
            patientId,
            doctorId
        });

        return res.status(201).json({
            message: "Patient mapped to doctor successfully",
            mapping
        });

    } catch (error) {
        console.error("Create mapping error:", error);

        return res.status(500).json({
            message: "Failed to create mapping",
            error: error.message
        });
    }
};


// Get All Mappings
const getMappings = async (req, res) => {
    try {
        const mappings = await PatientDoctor.findAll({
            include: [
                {
                    model: Patient,
                    attributes: ["id", "name"]
                },
                {
                    model: Doctor,
                    attributes: [
                        "id",
                        "name",
                        "specialization"
                    ]
                }
            ]
        });

        return res.status(200).json({
            mappings
        });

    } catch (error) {
        console.error("Get mappings error:", error);

        return res.status(500).json({
            message: "Failed to fetch mappings",
            error: error.message
        });
    }
};


// Get Doctors Mapped to a Particular Patient
const getPatientMappings = async (req, res) => {
    try {
        // Read patientId from the route parameter
        const patientId = req.params.patientId;

        if (!patientId) {
            return res.status(400).json({
                message: "Patient ID is required"
            });
        }

        // Check whether patient belongs to logged-in user
        const patient = await Patient.findOne({
            where: {
                id: patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // Find mappings for this patient
        const mappings = await PatientDoctor.findAll({
            where: {
                patientId: patientId
            },
            include: [
                {
                    model: Doctor,
                    attributes: [
                        "id",
                        "name",
                        "specialization",
                        "phone",
                        "email"
                    ]
                }
            ]
        });

        return res.status(200).json({
            patient,
            mappings
        });

    } catch (error) {
        console.error("Get patient mappings error:", error);

        return res.status(500).json({
            message: "Failed to fetch patient mappings",
            error: error.message
        });
    }
};


// Delete Mapping
const deleteMapping = async (req, res) => {
    try {
        const mapping = await PatientDoctor.findByPk(
            req.params.id
        );

        if (!mapping) {
            return res.status(404).json({
                message: "Mapping not found"
            });
        }

        // Verify that the patient belongs to logged-in user
        const patient = await Patient.findOne({
            where: {
                id: mapping.patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Mapping not found"
            });
        }

        await mapping.destroy();

        return res.status(200).json({
            message: "Mapping deleted successfully"
        });

    } catch (error) {
        console.error("Delete mapping error:", error);

        return res.status(500).json({
            message: "Failed to delete mapping",
            error: error.message
        });
    }
};


// Export Controllers
module.exports = {
    createMapping,
    getMappings,
    getPatientMappings,
    deleteMapping
};
