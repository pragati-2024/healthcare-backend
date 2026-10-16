
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const PatientDoctor = require("../models/PatientDoctor");
const { Op } = require("sequelize");

// Create Appointment
const createAppointment = async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            appointmentDate,
            reason
        } = req.body;

        if (!patientId || !doctorId || !appointmentDate || !reason) {
            return res.status(400).json({
                message: "All appointment fields are required"
            });
        }

        const date = new Date(appointmentDate);

        if (Number.isNaN(date.getTime())) {
            return res.status(400).json({
                message: "Invalid appointment date"
            });
        }

        if (date <= new Date()) {
            return res.status(400).json({
                message: "Appointment date must be in the future"
            });
        }

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

        const doctor = await Doctor.findByPk(doctorId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        const mapping = await PatientDoctor.findOne({
            where: {
                patientId,
                doctorId
            }
        });

        if (!mapping) {
            return res.status(400).json({
                message: "Patient is not mapped to this doctor"
            });
        }

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate: date,
            reason
        });

        const appointmentDetails = await Appointment.findByPk(
            appointment.id,
            {
                include: [
                    {
                        model: Patient,
                        as: "Patient",
                        attributes: [
                            "id",
                            "name",
                            "age",
                            "gender",
                            "phone"
                        ]
                    },
                    {
                        model: Doctor,
                        as: "Doctor",
                        attributes: [
                            "id",
                            "name",
                            "specialization",
                            "phone",
                            "email"
                        ]
                    }
                ]
            }
        );

        return res.status(201).json({
            message: "Appointment booked successfully",
            appointment: appointmentDetails
        });
    } catch (error) {
        console.error("Create Appointment Error:", error);

        return res.status(500).json({
            message: "Failed to book appointment",
            error: error.message
        });
    }
};

// Get All Appointments for Logged-in User
const getAppointments = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            where: {
                userId: req.user.id
            },
            attributes: ["id"]
        });

        const patientIds = patients.map(patient => patient.id);

        const appointments = await Appointment.findAll({
            where: {
                patientId: {
                    [Op.in]: patientIds
                }
            },
            include: [
                {
                    model: Patient,
                    as: "Patient",
                    attributes: [
                        "id",
                        "name",
                        "age",
                        "gender",
                        "phone"
                    ]
                },
                {
                    model: Doctor,
                    as: "Doctor",
                    attributes: [
                        "id",
                        "name",
                        "specialization",
                        "phone",
                        "email"
                    ]
                }
            ],
            order: [["appointmentDate", "ASC"]]
        });

        return res.status(200).json({
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error("Get Appointments Error:", error);

        return res.status(500).json({
            message: "Failed to fetch appointments",
            error: error.message
        });
    }
};

// Get Appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(
            req.params.id,
            {
                include: [
                    {
                        model: Patient,
                        as: "Patient",
                        attributes: [
                            "id",
                            "name",
                            "age",
                            "gender",
                            "phone"
                        ]
                    },
                    {
                        model: Doctor,
                        as: "Doctor",
                        attributes: [
                            "id",
                            "name",
                            "specialization",
                            "phone",
                            "email"
                        ]
                    }
                ]
            }
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const patient = await Patient.findOne({
            where: {
                id: appointment.patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        return res.status(200).json({ appointment });
    } catch (error) {
        console.error("Get Appointment By ID Error:", error);

        return res.status(500).json({
            message: "Failed to fetch appointment",
            error: error.message
        });
    }
};

// Update Appointment
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const patient = await Patient.findOne({
            where: {
                id: appointment.patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const { appointmentDate, reason, status } = req.body;

        const allowedStatuses = [
            "Scheduled",
            "Completed",
            "Cancelled"
        ];

        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid appointment status"
            });
        }

        if (appointmentDate !== undefined) {
            const date = new Date(appointmentDate);

            if (Number.isNaN(date.getTime())) {
                return res.status(400).json({
                    message: "Invalid appointment date"
                });
            }

            if (date <= new Date() && status !== "Completed") {
                return res.status(400).json({
                    message: "Appointment date must be in the future"
                });
            }

            appointment.appointmentDate = date;
        }

        if (reason !== undefined) {
            if (!String(reason).trim()) {
                return res.status(400).json({
                    message: "Reason cannot be empty"
                });
            }

            appointment.reason = reason;
        }

        if (status !== undefined) {
            appointment.status = status;
        }

        await appointment.save();

        const updatedAppointment = await Appointment.findByPk(
            appointment.id,
            {
                include: [
                    {
                        model: Patient,
                        as: "Patient",
                        attributes: [
                            "id",
                            "name",
                            "age",
                            "gender",
                            "phone"
                        ]
                    },
                    {
                        model: Doctor,
                        as: "Doctor",
                        attributes: [
                            "id",
                            "name",
                            "specialization",
                            "phone",
                            "email"
                        ]
                    }
                ]
            }
        );

        return res.status(200).json({
            message: "Appointment updated successfully",
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error("Update Appointment Error:", error);

        return res.status(500).json({
            message: "Failed to update appointment",
            error: error.message
        });
    }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const patient = await Patient.findOne({
            where: {
                id: appointment.patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        await appointment.destroy();

        return res.status(200).json({
            message: "Appointment deleted successfully"
        });
    } catch (error) {
        console.error("Delete Appointment Error:", error);

        return res.status(500).json({
            message: "Failed to delete appointment",
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};