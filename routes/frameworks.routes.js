const express = require("express");
const utils = require("../utils/utils");
const fs =require("fs/promises")

const frameworksRouter = express.Router();

frameworksRouter.get("/", (req, res) => {
    return utils.readFrameworks()
    .then((data) => {
        res.status(200).json({
            frameworks: data,
        })
    })
})

frameworksRouter.post("/", (req, res) => {
    const newFramework = req.body;
    console.log("New framework is ", newFramework);
    return utils.readFrameworks()
    .then((data) => {
        console.log("Data ------ ", data);
        data.push(newFramework.framework)

        return fs.writeFile("frameworks.json", JSON.stringify(data))
    })
    .then(() => {
        return res.status(201).json({
            message: "New frameworks added",
            framework: newFramework.framework,
            error: null,
        })
    })
})

module.exports = frameworksRouter;