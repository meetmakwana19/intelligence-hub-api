const express = require("express");
const utils = require("../utils/utils");
const fs = require("fs/promises");

const userToneRouter = express.Router();

// Pagination middleware
const paginateResults = require("../middleware/paginationMiddleware")


userToneRouter.get("/", (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 30;

    return utils.readTones()
    .then((data) => {
        const paginatedData = paginateResults(data, startIndex, limit);
        const totalCount = data.length; // Calculate total count

        res.status(200).json({
            message: "Tones fetched with pagination.",
            data: {
                totalCount,
                paginatedData,
            },
            error: null,
        });
    });
});

userToneRouter.post("/", (req, res) => {
    const newTone = req.body;
    return utils.readTones()
        .then((data) => {
            data.push(newTone);

            return fs.writeFile("tones.json", JSON.stringify(data));
        })
        .then(() => {
            return res.status(201).json({
                message: "New Tone added",
                data: newTone,
                error: null,
            });
        });
});

module.exports = userToneRouter;
