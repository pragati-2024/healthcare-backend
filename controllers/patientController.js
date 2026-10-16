const Patient = require("../models/Patient");

// Add Patient
const createPatient = async (req, res) => {
    try {
        const { name, age, gender, phone, address } = req.body;

        if (!name || !age || !gender || !phone || !address) {
            return res.status(400).json({
                message: "All patient fields are required"
            });
        }

        const patient = await Patient.create({
            name,
            age,
            gender,
            phone,
            address,
            userId: req.user.id
        });

        res.status(201).json({
            message: "Patient created successfully",
            patient
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create patient",
            error: error.message
        });
    }
};


// Get all patients of logged-in user
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            where: {
                userId: req.user.id
            }
        });

        res.json({
            patients
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patients",
            error: error.message
        });
    }
};


// Get single patient
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.json({
            patient
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient",
            error: error.message
        });
    }
};


// Update patient
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const { name, age, gender, phone, address } = req.body;

        await patient.update({
            name,
            age,
            gender,
            phone,
            address
        });

        res.json({
            message: "Patient updated successfully",
            patient
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update patient",
            error: error.message
        });
    }
};


// Delete patient
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        await patient.destroy();

        res.json({
            message: "Patient deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete patient",
            error: error.message
        });
    }
};


module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
};