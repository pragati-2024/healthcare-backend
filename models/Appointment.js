
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Patient = require("./Patient");
const Doctor = require("./Doctor");

const Appointment = sequelize.define("Appointment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(
            "Scheduled",
            "Completed",
            "Cancelled"
        ),
        allowNull: false,
        defaultValue: "Scheduled"
    }
});

// Associations
Appointment.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "Patient"
});

Appointment.belongsTo(Doctor, {
    foreignKey: "doctorId",
    as: "Doctor"
});

module.exports = Appointment;
