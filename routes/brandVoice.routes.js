const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const brandVoiceRouter = express.Router();

brandVoiceRouter.get("/", (req, res) => {
    return utils.readVoices()
    .then((data) => {
        res.status(200).json({
            message: "All voices fetched.",
            data,
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