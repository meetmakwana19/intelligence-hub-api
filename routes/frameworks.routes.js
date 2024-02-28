const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const frameworksRouter = express.Router();

frameworksRouter.get("/", (req, res) => {
    return utils.readFrameworks()
    .then((data) => {
        res.status(200).json({
            message: "All frameworks fetched.",
            data,
            error: null,
        })
    })
})

frameworksRouter.post("/", (req, res) => {
    const newFramework = req.body;
    console.log("New framework is ", newFramework);
    return utils.readFrameworks()
    .then((data) => {
        console.log("Data ------ ", data);
        data.push(newFramework)

        return fs.writeFile("frameworks.json", JSON.stringify(data))
    })
    .then(() => {
        return res.status(201).json({
            message: "New frameworks added",
            data: newFramework,
            error: null,
        })
    })
})

module.exports = frameworksRouter;