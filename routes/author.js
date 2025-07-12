import express from "express";
import {
  create_author,
  get_all_author,
} from "../controllers/author_controller.js";

const router = express.Router();

router.post("/author", create_author);
router.get("/author", get_all_author);

export default router;
