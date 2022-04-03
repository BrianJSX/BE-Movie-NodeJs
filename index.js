require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const listsRouter = require("./routes/lists");
const socketEvent = require("./modules/SocketEvent");

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connecting Successfull");
  })
  .catch((error) => {
    console.log(error);
  });

//cor
app.use(cors());

//body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/lists", listsRouter);

let port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server is running port ${port}`);
});

//socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.URL_CORS,
  },
});

socketEvent(io);
