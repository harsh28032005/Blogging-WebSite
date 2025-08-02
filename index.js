import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import author from "./routes/author.js";
import blog from "./routes/blog.js";

const app = express();

app.use(express.json());

app.use("", author)
app.use("", blog)

const url = process.env.MongoUrl;

mongoose
  .connect(url)
  .then(() => console.log("MongoDB Database is connected successfully"))
  .catch((err) => console.log("Error to connect MongoDB Database", err));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on the port ${process.env.PORT}`)
);

