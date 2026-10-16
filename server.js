
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { sequelize, connectDB } = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const mappingRoutes = require("./routes/mappingRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Healthcare API is running successfully"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/mappings", mappingRoutes);
app.use("/api/appointments", appointmentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        await sequelize.sync();

        console.log("Database tables synchronized");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
};

startServer();
