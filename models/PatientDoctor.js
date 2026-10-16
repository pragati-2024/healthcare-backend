const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

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

module.exports = PatientDoctor;