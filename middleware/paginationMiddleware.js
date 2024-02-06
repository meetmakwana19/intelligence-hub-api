// Pagination middleware
function paginateResults(model, startIndex, limit) {
    const endIndex = startIndex + limit;

    const results = {};

    if (endIndex < model.length) {
        results.next = {
            startIndex: endIndex,
            limit: limit,
        };
    }

    if (startIndex > 0) {
        results.previous = {
            startIndex: Math.max(0, startIndex - limit),
            limit: limit,
        };
    }

    results.results = model.slice(startIndex, endIndex);

    return results;
}

module.exports = paginateResults;