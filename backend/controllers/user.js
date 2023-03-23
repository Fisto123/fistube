import { createError } from "../error.js"
import userModel from '../model/user.js'
import videoModel from '../model/video.js'
export const updateUser = async(req,res,next) => {
      if(req.params.id === req.user.id){
      //todo
      try {
         const updatedUser = await userModel.findByIdAndUpdate(req.params.id,{
        $set:req.body
       },
       {new:true}
       ) 
           res.status(200).json(updatedUser) 
      } catch (error) {
          next(error)
      }
      }
      else{
        return next(createError(403,'You are not authorized to update this account'))
      }

}


export const deleteUser = async(req,res,next) => {
      if(req.params.id === req.user.id){
      //todo
      try {
         await userModel.findByIdAndRemove(req.params.id) 
           res.status(200).json('sucessfully deleted') 
      } catch (error) {
          next(error)
      }
      }
      else{
        return next(createError(403,'You are not authorized to delete this account'))
      }

}


export const getUser = async(req,res,next) => {
     try {
         const user = await userModel.findById(req.params.id)
         res.status(200).json(user)
     } catch (error) {
        next(error) 
     } 

}


export const subscribeUser = async(req,res,next) => {
     try {
       //this enables ME TO SUSCRIBE TO OTHER USERS USING THEIR ID(ID)
     
         await userModel.findByIdAndUpdate(req.user.id,{
            $push:{subscribedUsers:req.params.id}
         })
           //It allows other people to subscribe to my channel using my own ID/IDENTITY
         await userModel.findByIdAndUpdate(req.params.id,{
            $inc:{subscribed:1}
         })
         res.status(200).json('subscription successful')
     } catch (error) {
        next(error) 
     } 
}

export const unsubscribeUser = async (req, res, next) => {
  try {
    try {
      await userModel.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await userModel.findByIdAndUpdate(req.params.id, {
        $inc: { subscribed: -1 },
      });
      res.status(200).json("Unsubscription successfull.")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
export const likeVideo= async(req,res,next) => {
         const id = req.user.id;
         const videoId = req.params.videoid
    try {
           await videoModel.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id},
           })
           res.status(200).json('The video has been liked')
     } catch (error) {
        next(error) 
     } 

}
export const dislikeVideo = async(req,res,next) => {
         const id = req.user.id;
         const videoId = req.params.videoid
     try {
           await videoModel.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id},
           })
           res.status(200).json('The video has been disliked')
     } catch (error) {
        next(error) 
     } 

}
















