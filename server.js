require("dotenv").config();
const config = require("config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");

//routers
const workspaceRouter = require("./routes/workspaceRoutes");
const projectRouter = require("./routes/projectRoutes");
const userRouter = require("./routes/userRoutes");
const teamRouter = require("./routes/teamRoutes");
const taskRouter = require("./routes/taskRoutes");
const messageRouter = require("./routes/messageRoutes");

//constants
const PORT = process.env.PORT || 3001;
const MONGO_CONNECTION = config.get("db.connection-string");

const app = express();
const http = require("http").createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json({ extended: true }));

//Routes
app.get("/", async (req, res) => {
  res.send("<h1>TaskList Server </h1>");
});
app.use("/workspace", workspaceRouter);
app.use("/project", projectRouter);
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/task", taskRouter);
app.use("/message", messageRouter);
const server = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    http.listen(PORT, () => {
      console.log("Server started on ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
