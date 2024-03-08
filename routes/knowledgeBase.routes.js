const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const knowledgeBaseRouter = express.Router();

// Pagination middleware
const paginateResults = require("../middleware/paginationMiddleware")


knowledgeBaseRouter.get("/", (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 30;

    return utils.readKnowledge()
    .then((data) => {
        const paginatedData = paginateResults(data, startIndex, limit);
        const totalCount = data.length; // Calculate total count

        res.status(200).json({
            message: "All knowledge bases fetched.",
            data: {
                totalCount,
                paginatedData,
            },
            error: null,
        })
    })
})

knowledgeBaseRouter.post("/", (req, res) => {
    const newKnowledge = req.body;
    return utils.readKnowledge()
    .then((data) => {
        data.push(newKnowledge)

        return fs.writeFile("knowledge.json", JSON.stringify(data))
    })
    .then(() => {
        return res.status(201).json({
            message: "New knowledge added",
            data: newKnowledge,
            error: null,
        })
    })
})

module.exports = knowledgeBaseRouter;