const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const userToneRouter = express.Router();

userToneRouter.get("/", (req, res) => {
    return utils.readTones()
    .then((data) => {
        res.status(200).json({
            message: "All tones fetched.",
            data,
            error: null,
        })
    })
})

userToneRouter.post("/", (req, res) => {
    const newTone = req.body;
    return utils.readTones()
    .then((data) => {
        data.push(newTone)

        return fs.writeFile("tones.json", JSON.stringify(data))
    })
    .then(() => {
        return res.status(201).json({
            message: "New Tone added",
            data: newTone,
            error: null,
        })
    })
})

module.exports = userToneRouter;