import "dotenv/config";

export const errHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? err.stack : undefined,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error! Please Try again!",
  });
};
