
// middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error("Server Error:", err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message || "Something went wrong"
    });
};

module.exports = errorMiddleware;
