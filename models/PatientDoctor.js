const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Patient = require("./Patient");
const Doctor = require("./Doctor");

const PatientDoctor = sequelize.define(
    "PatientDoctor",
    {
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
        }
    },
    {
        tableName: "patient_doctors",
        timestamps: true
    }
);

PatientDoctor.belongsTo(Patient, {
    foreignKey: "patientId"
});

PatientDoctor.belongsTo(Doctor, {
    foreignKey: "doctorId"
});

module.exports = PatientDoctor;