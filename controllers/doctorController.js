const Doctor = require("../models/Doctor");

// Add Doctor
const createDoctor = async (req, res) => {
    try {
        const { name, specialization, phone, email } = req.body;

        if (!name || !specialization || !phone || !email) {
            return res.status(400).json({
                message: "All doctor fields are required"
            });
        }

        const existingDoctor = await Doctor.findOne({
            where: { email }
        });

        if (existingDoctor) {
            return res.status(400).json({
                message: "Doctor with this email already exists"
            });
        }

        const doctor = await Doctor.create({
            name,
            specialization,
            phone,
            email
        });

        res.status(201).json({
            message: "Doctor created successfully",
            doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create doctor",
            error: error.message
        });
    }
};


// Get all Doctors
const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll();

        res.json({
            doctors
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctors",
            error: error.message
        });
    }
};


// Get Doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctor",
            error: error.message
        });
    }
};


// Update Doctor
const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        const { name, specialization, phone, email } = req.body;

        await doctor.update({
            name,
            specialization,
            phone,
            email
        });

        res.json({
            message: "Doctor updated successfully",
            doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor",
            error: error.message
        });
    }
};


// Delete Doctor
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        await doctor.destroy();

        res.json({
            message: "Doctor deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete doctor",
            error: error.message
        });
    }
};


module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};