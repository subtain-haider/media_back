exports.success = (res, message, data = null) => res.status(200).json({ status: "success", message, data });
exports.error = (res, message, code = 500) => res.status(code).json({ status: "error", message });
exports.validationError = (res, errors) => res.status(400).json({ status: "error", message: "Validation error", errors });
