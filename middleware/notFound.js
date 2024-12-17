const { error } = require("../utils/apiResponse");

const notFound = (req, res, next) => {
    error(res, "Resource not found", 404);
};

module.exports = notFound;
