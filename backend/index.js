/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const taskRouter = require("./routes/task");

const app = express();

// middlewares

app.use(express.json());
app.use(cors());

// routes

app.use("/task", taskRouter);

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI;
    const port = process.env.PORT || 4001;

    if (!mongoUri) throw new Error("did not find mongoUri");
    await mongoose.connect(mongoUri);

    app.listen(port, () => console.log(`port ${port}`));
  } catch (error) {
    console.error("message", error);
    process.exit(1)
  }
}

start()