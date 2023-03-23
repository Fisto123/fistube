import { createError } from "../error.js";
import commentModel from "../model/comments.js";
import videoModel from "../model/video.js";
export const addComment = async (req, res, next) => {
  let comment = req.body;
  try {
    const comments = new commentModel({
      ...comment,
      userId: req.user.id,
    });
    const savedComment = await comments.save();
    res.status(200).send(savedComment);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.params.id);
    const video = await videoModel.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await commentModel.findById(req.params.id);
      res.status(200).json("comment deleted successfully");
    }
  } catch (error) {
    next(createError(403, "you cant delete only your comment"));
  }
};
export const getComment = async (req, res, next) => {
  try {
    //GET ALL COMMENTS OF A VIDEO
    const comments = await commentModel.find({ videoId: req.params.videoid });
    res.status(200).json(comments);
  } catch (error) {}
};
