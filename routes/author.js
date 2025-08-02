import express from "express";
import {
  create_author,
  get_all_author,
  login,
} from "../controllers/author_controller.js";

const router = express.Router();

router.post("/author", create_author);
router.get("/author", get_all_author);
router.post("/login", login);

export default router;
