import { createError } from "../error.js";
import videoModel from "../model/video.js";
import userModel from "../model/user.js";

export const createVideo = async (req, res, next) => {
  //create video

  const newVideo = req.body;
  try {
    //THIS ALLOWS ME TO POST A VIDEO WITH MY USER ID INFORMATION  TO KNOW THAT ITS MINE
    const savedVideo = new videoModel({
      ...newVideo,
      userId: req.user.id,
    });
    const video = await savedVideo.save();
    res.status(200).json(video);
  } catch (err) {
    //catch error
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  //update video
  const video = await videoModel.findById(req.params.id);
  if (!video) return next(createError(404, "video not found"));
  if (req.user.id === video.userId) {
    const updatedVideo = await videoModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedVideo);
  } else {
    return next(createError(403, "you can update only your video"));
  }
};
export const deleteVideo = async (req, res, next) => {
  //delete video
  const video = await videoModel.findByIdAndDelete(req.params.id);
  if (!video) return next(createError(404, "video not found"));
  if (req.user.id === video.userId) {
    await videoModel.findByIdAndDelete(req.params.id);
    res.status(200).json("video have been deleted");
  } else {
    return next(createError(403, "you can delete only your video"));
  }
};
export const getVideo = async (req, res, next) => {
  //get video
  try {
    const video = await videoModel.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    return next(error);
  }
};

export const trendingVideo = async (req, res, next) => {
  //get no of most viewed in descending
  try {
    let viewed = await videoModel.find().sort({ views: -1 });
    res.status(200).json(viewed);
  } catch (error) {
    return next(error);
  }
};
export const randVideo = async (req, res, next) => {
  //get video randomly
  try {
    const videos = await videoModel.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json(videos);
  } catch (error) {
    return next(createError(403, "you can update only your video"));
  }
};

export const getByTag = async (req, res, next) => {
  //get video by the tag
  //seperate commas
  const tags = req.query.tags.split(",");
  try {
    const videos = await videoModel.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    return next(error);
  }
};

export const Search = async (req, res, next) => {
  //get video by search
  try {
    const search = req.query.search;
    const videos = await videoModel
      .find({ title: { $regex: search, $options: "i" } })
      .limit(20);
    res.status(200).json(videos);
  } catch (error) {}
};
export const addView = async (req, res, next) => {
  try {
    await videoModel.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};
export const subscribedVideo = async (req, res, next) => {
  //find ALL the channelS i personally subscribed TO
  try {
    const user = await userModel.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers; //ope channel, tosin channelID
    //find where the ID OF CHANNELS I SUBSCRIBED TO IS EQUAL TO THE VIDEOS ID
    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return videoModel.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    return next(
      createError(403, "you can only view only your subscribed video")
    );
  }
};
