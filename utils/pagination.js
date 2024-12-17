const paginate = async (model, query = {}, options = {}) => {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch documents with pagination and sorting
    const data = await model.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sort);

    // Count total documents
    const totalItems = await model.countDocuments(query);

    return {
        data,
        pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit),
        },
    };
};

module.exports = paginate;
