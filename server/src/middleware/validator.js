export function validateRequestBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === "");
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Missing required field(s): ${missing.join(", ")}`,
          statusCode: 400,
        },
      });
    }
    next();
  };
}
