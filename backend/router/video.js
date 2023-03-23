import express from "express";
import {
  addView,
  createVideo,
  deleteVideo,
  getByTag,
  getVideo,
  randVideo,
  Search,
  subscribedVideo,
  trendingVideo,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../verify.js";

const router = express.Router();

//create Video
router.post("/api/createVideo", verifyToken, createVideo);

//update Video
router.put("/api/updateVideo/:id", verifyToken, updateVideo);

//get Video
router.get("/api/getVideo/:id", getVideo);

//delete Video
router.delete("/api/deleteVideo/:id", verifyToken, deleteVideo);

//trending video
router.get("/api/trendingVideo", trendingVideo);

//random Video
router.get("/api/randomVideo", randVideo);

//subscribed channel Video
router.get("/api/subscribedchannel", verifyToken, subscribedVideo);

//add view
router.put("/api/addview/:id", addView);

//search Video
router.get("/api/search", Search);

//get by tags
router.get("/api/searchByTags", getByTag);

export default router;
