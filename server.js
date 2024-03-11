const express = require("express");
const router = require("./routes/index");
const app = express();
const cors = require("cors");

app.use(express.json());

// needed this middleware because the fetch() methods on the frontend was getting error of `blocked by CORS policy`
app.use(cors());

app.use("/profiles", router.profilesRouter);
app.use("/user-tone", router.userToneRouter);
app.use("/knowledge-base", router.knowledgeBaseRouter);
app.use("/frameworks", router.frameworksRouter);

app.get("/greeting", (req, res) => {
  return res.send("Greetings from Intelligence Hub API.");
});

app.get("/", (req, res) => {
  return res.send("Welcome to Intelligence Hub API.");
});

app.listen(3000, () => {
  console.log("Intelligence Hub API is listening !");
});
