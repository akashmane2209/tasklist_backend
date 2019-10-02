require("dotenv").config();
const config = require("config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const router = require("./routes/routes");
//constants
const PORT = process.env.PORT || 3001;
const MONGO_CONNECTION = config.get("db.connection-string");

const app = express();
const http = require("http").createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParse.urlencoded({ extended: true }));

//Routes
app.use("/", router);

const server = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
    http.listen(PORT, () => {
      console.log("Server started on ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
