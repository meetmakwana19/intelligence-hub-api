const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const knowledgeBaseRouter = express.Router();

knowledgeBaseRouter.get("/", (req, res) => {
    return utils.readKnowledge()
    .then((data) => {
        res.status(200).json({
            message: "All knowledge bases fetched.",
            data,
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