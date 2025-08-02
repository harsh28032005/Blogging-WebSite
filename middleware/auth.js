import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import blog from "../models/blog_model.js";
export const auth = async (req, res, next) => {
  let token = req.headers["access_token"];

  if (!token)
    return res.status(401).send({ status: false, msg: "Token is missing" });

  let decoded_token = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    { ignoreExpiration: true },
    (err, result) => {
      if (err)
        return res.status(401).send({ status: false, msg: "Invalid token" });
      else if (Date.now() / 1000 > result.exp)
        return res.status(401).send({ status: false, msg: "Token expired" });
      else return result;
    }
  );

  if (req.body?.author_id) {
    if (decoded_token.author_id != req.body.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized access" });
  }
  if (req.query?.author_id) {
    if (decoded_token.author_id != req.query.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized access" });
  }

  if (req.params?.author_id) {
    if (decoded_token.author_id != req.params.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized access" });
  }

  if (req.params?.blog_id) {
    if (!mongoose.Types.ObjectId.isValid(req.params.blog_id))
      return res.status(400).send({ status: false, msg: "Invalid blog_id" });

    let blog_id_exist = await blog.findOne({
      _id: req.params.blog_id,
    });

    if (!blog_id_exist)
      return res.status(404).send({ status: false, msg: "No blog found" });

    if (blog_id_exist.isDeleted)
      return res
        .status(400)
        .send({ status: false, msg: "Blog has been deleted" });

    if (blog_id_exist.author_id != decoded_token.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized access" });
  }
  next();
};
