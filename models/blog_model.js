import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const blog_schema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    body: { type: String, trim: true, required: true },
    author_id: { type: ObjectId, ref: "author", trim: true, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, trim: true, required: true },
    subcategory: { type: [String], default: [] },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const blog = new mongoose.model("blog", blog_schema);

export default blog;
