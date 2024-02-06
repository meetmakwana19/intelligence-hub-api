const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const brandVoiceRouter = express.Router();

// Pagination middleware
const paginateResults = require("../middleware/paginationMiddleware")

brandVoiceRouter.get("/", (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 30;

    return utils.readVoices()
    .then((data) => {
        const paginatedData = paginateResults(data, startIndex, limit);
        const totalCount = data.length; // Calculate total count

        res.status(200).json({
            message: "All voices fetched.",
            data: {
                totalCount,
                paginatedData,
            },
            error: null,
        })
    })
})

brandVoiceRouter.post("/", (req, res) => {
    const newVoice = req.body;
    return utils.readVoices()
    .then((data) => {
        data.push(newVoice)

        return fs.writeFile("voices.json", JSON.stringify(data))
    })
    .then(() => {
        return res.status(201).json({
            message: "New voice added",
            data: newVoice,
            error: null,
        })
    })
})

module.exports = brandVoiceRouter;