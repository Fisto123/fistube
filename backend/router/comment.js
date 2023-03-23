import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
} from "../controllers/comment.js";
import { verifyToken } from "../verify.js";

const router = express.Router();

//ADd comment
router.post("/api/addcomment", verifyToken, addComment);

//delete comment
router.delete("/api/deletecomment/:id", verifyToken, deleteComment);

//get comment
router.get("/api/getcomment/:videoid", getComment);
//subscribe comment

export default router;
