import mongoose from "mongoose";
import author from "../models/author_model.js";
import blog from "../models/blog_model.js";

export const create_blog = async (req, res) => {
  try {
    let { title, body, author_id, tags, category, subcategory } = req.body;

    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty" });

    if (!title)
      return res.status(400).send({ status: false, msg: "title is required" });

    if (!isNaN(title))
      return res.status(400).send({ status: false, msg: "Invalid title" });

    if (!body)
      return res.status(400).send({ status: false, msg: "body is required" });

    if (!isNaN(body))
      return res.status(400).send({ status: false, msg: "Invalid body" });

    if (!author_id)
      return res
        .status(400)
        .send({ status: false, msg: "author_id is required" });

    if (author_id && !mongoose.Types.ObjectId.isValid(author_id))
      return res.status(400).send({ status: false, msg: "Invalid author_id" });

    const is_author_exist = await author.findOne({
      _id: author_id,
      isDeleted: false,
    });

    if (!is_author_exist)
      return res.status(404).send({ status: false, msg: "No author found" });

    if (req.body.hasOwnProperty("tags")) {
      if (!Array.isArray(tags))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of tags" });

      if (!tags.length)
        return res
          .status(400)
          .send({ status: false, msg: "Mention some tags" });

      for (let ele of tags) {
        if (!isNaN(ele))
          return res
            .status(400)
            .send({ status: false, msg: "Invalid tag element" });
      }
    }
    if (!category)
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });

    if (!isNaN(category))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid category" });

    if (req.body.hasOwnProperty("subcategory")) {
      if (!Array.isArray(subcategory))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of subcategory" });

      if (!subcategory.length)
        return res
          .status(400)
          .send({ status: false, msg: "Mention some subcategory" });

      for (let ele of subcategory) {
        if (!isNaN(ele))
          return res
            .status(400)
            .send({ status: false, msg: "Invalid subcategory element" });
      }
    }
    const save_data = await blog.create(req.body);
    return res.status(201).send({
      status: true,
      msg: "Blog created successfully",
      data: save_data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_blog = async (req, res) => {
  try {
    let { author_id, category, tags, subcategory } = req.query;

    let filter = { isDeleted: false, isPublished: true };

    if (author_id) filter.author_id = author_id;

    if (category) filter.category = category;

    if (tags) filter.tags = { $in: tags.split(",") };

    if (subcategory) filter.subcategory = { $in: subcategory.split(",") };

    let get_blog_data = await blog.find(filter);

    if (get_blog_data.length)
      return res
        .status(200)
        .send({ status: true, msg: "All blogs list", data: get_blog_data });
    else {
      return res.status(404).send({ status: false, msg: "No data found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const update_blog = async (req, res) => {
  try {
    let { title, body, tags, subcategory } = req.body;
    let { blog_id } = req.params;

    if (!blog_id)
      return res.status(400).send({ status: 400, msg: "blog_id is required" });

    if (blog_id && !mongoose.ObjectId.isValid(blog_id))
      return res.status(400).send({ status: false, msg: "Invalid blog_id" });

    let blog_id_exist = await blog.findOne({ _id: blog_id, isDeleted: false });

    if (!blog_id_exist)
      return res
        .status(404)
        .send({ status: false, msg: "No blog found to update" });

    if (req.body.hasOwnProperty("title") && !isNaN(title))
      return res.status(400).send({ status: false, msg: "Invalid blog title" });

    if (req.body.hasOwnProperty("body") && !isNaN(body))
      return res.status(400).send({ status: false, msg: "Invalid blog body" });

    if (req.body.hasOwnProperty("tags") && !isNaN(tags))
      return res.status(400).send({ status: false, msg: "Invalid blog tag" });

    if (req.body.hasOwnProperty("subcategory") && !isNaN(subcategory))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid blog subcategory" });

    let update_blog_data = await blog.findOneAndUpdate(
      { _id: blog_id, isDeleted: false },
      {
        $set: {
          title: title,
          body: body,
          isPublished: true,
          publishedAt: new Date(),
        },
        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      msg: "Blog Updated successfully",
      data: update_blog_data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const delete_blog = async (req, res) => {
  try {
    let { blog_id } = req.params;

    let deleted_blog = await blog.findOneAndUpdate(
      { _id: blog_id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      msg: "Blog deleted successfully",
      data: deleted_blog,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const deleted_blog_by_query = async (req, res) => {
  try {
    let { author_id, category, tags, subcategory, isPublished } = req.query;
    let filter = { isDeleted: false };
    let deep_filter = JSON.parse(JSON.stringify(req.query));

    if (deep_filter.hasOwnProperty("author_id")) {
      if (!mongoose.Types.ObjectId.isValid(author_id))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid author_id" });
      else filter["author_id"] = author_id;
    }

    if (deep_filter.hasOwnProperty("category")) {
      if (!isNaN(category))
        return res.status(400).send({ status: false, msg: "Invalid category" });
      else filter["category"] = category;
    }

    if (deep_filter.hasOwnProperty("tags")) {
      if (!isNaN(tags))
        return res.status(500).send({ status: false, msg: "Invalid tag" });
      else filter["tags"] = { $in: [tags] };
    }

    if (deep_filter.hasOwnProperty("subcategory")) {
      if (!isNaN(subcategory))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid subcategory" });
      else filter["subcategory"] = { $in: [subcategory] };
    }

    if (deep_filter.hasOwnProperty("isPublished")) {
      if (isPublished !== true && isPublished !== false)
        return res.status(500).send({
          status: false,
          msg: "isPublished should be a boolean value",
        });
      else if (!isPublished) {
        filter["isPublished"] = isPublished;
      }
    }

    let deleted_blogs = await blog.updateMany(filter, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });

    if (deleted_blogs.matchedCount == 0)
      return res
        .status(404)
        .send({ status: false, msg: "No Blog found to delete" });
    else
      return res.status(200).send({
        status: true,
        msg: "Blog deleted successfully",
        data: deleted_blogs,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
