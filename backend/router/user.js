import express from "express";
import {
  deleteUser,
  dislikeVideo,
  getUser,
  likeVideo,
  subscribeUser,
  unsubscribeUser,
  updateUser,
} from "../controllers/user.js";
import { verifyToken } from "../verify.js";

const router = express.Router();

//update User
router.put("/api/updateUser/:id", verifyToken, updateUser);

//delete User
router.delete("/api/deleteUser/:id", verifyToken, deleteUser);

//get User
router.get("/api/getUser/:id", getUser);

//subscribe User

router.put("/api/subcribeChannel/:id", verifyToken, subscribeUser);

//unsubscribe User
router.put("/api/unsubcribeChannel/:id", verifyToken, unsubscribeUser);

//like video
router.put("/api/likevid/:videoid", verifyToken, likeVideo);

//dislike video
router.put("/api/dislikevid/:videoid", verifyToken, dislikeVideo);

export default router;
