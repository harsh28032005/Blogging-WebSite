import mongoose from "mongoose";
const author_schema = new mongoose.Schema(
  {
    fname: { type: String, trim: true, lowercase: true, required: true },
    lname: { type: String, trim: true, lowercase: true, required: true },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      trim: true,
      required: true,
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isDeleted: {type: Boolean, default: false}
  },
  { timestamps: true }
);

const author = new mongoose.model("author", author_schema);
export default author;
