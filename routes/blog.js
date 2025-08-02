import express from "express";
import { create_blog, delete_blog, deleted_blog_by_query, get_blog, update_blog } from "../controllers/blog_controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/blogs", auth, create_blog); // route level middleware
router.get("/blogs", auth, get_blog);
router.put("/blogs/:blog_id", auth, update_blog);
router.delete("/blogs/:blog_id", auth, delete_blog);
router.delete("/blogs", auth, deleted_blog_by_query);

export default router;
