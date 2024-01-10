const express = require("express");

const app = express();

app.get("/greeting", (req, res) => {
    return res.send("Greetings from Intelligence Hub API.")
})

app.get("/", (req, res) => {
    return res.send("Welcome to Intelligence Hub API.")
})
app.listen(3000, () => {
    console.log("Intelligence Hub API is listening !");
})