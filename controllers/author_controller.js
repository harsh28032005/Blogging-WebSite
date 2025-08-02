import mongoose from "mongoose";
import author from "../models/author_model.js";
import jwt from "jsonwebtoken";

export const create_author = async (req, res) => {
  try {
    let { fname, lname, title, email, password } = req.body;

    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request Body can not be empty" });

    if (!fname)
      return res.status(400).send({ status: false, msg: "fname is required" });

    if (fname && !isNaN(fname))
      return res.status(400).send({ status: false, msg: "Invalid fname" });

    if (!lname)
      return res.status(400).send({ status: false, msg: "lname is required" });

    if (lname && !isNaN(lname))
      return res.status(400).send({ status: false, msg: "Invalid lname" });

    if (!title)
      return res.status(400).send({ status: false, msg: "title is required" });

    if (
      title &&
      (!isNaN(title) || !["Mr", "Mrs", "Miss"].includes(title.trim()))
    )
      return res.status(400).send({
        status: false,
        msg: "Invalid title, title must be Mr, Mrs or Miss",
      });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    if (password && !isNaN(password))
      return res.status(400).send({ status: false, msg: "Invalid password" });

    if (!email)
      return res.status(400).send({ status: false, msg: "email is required" });

    if (email && !isNaN(email))
      return res.status(400).send({ status: false, msg: "Invalid email" });

    let is_mail_exist = await author.findOne({
      email: email,
      isDeleted: false,
    });

    if (is_mail_exist)
      return res
        .status(400)
        .send({ status: false, msg: "email already used for another author" });

    let save_data = await author.create(req.body);

    return res.status(201).send({
      status: true,
      msg: "author created successfully",
      data: save_data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_all_author = async (req, res) => {
  try {
    let { fname, search } = req.query;

    let filter = { isDeleted: false};

    if (fname) filter.fname = fname;

    if (search) filter.fname = { $regex: search, $options: "i" };

    let get_author = await author.find(filter)
    // .select({ _id: true, fname: true });

    if (!get_author.length)
      return res.status(404).send({ status: false, msg: "No author found" });
    else
      return res
        .status(200)
        .send({ status: true, msg: "List of authors", data: get_author });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty" });

    let { email, password } = req.body;

    if (!email)
      return res.status(400).send({ status: false, msg: "email is required" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    let check_author = await author.findOne({
      email: email,
      password: password,
      isDeleted: false,
    });

    if (!check_author)
      return res
        .status(401)
        .send({ status: false, msg: "Invalid Credentials" });

    let token = jwt.sign(
      {
        author_id: check_author._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).send({
      status: true,
      msg: "Author loged in successfully",
      data: { token: token, author_id: check_author._id },
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
