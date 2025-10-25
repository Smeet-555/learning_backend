import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// creating a like toggler for any model
const toggleLike = asyncHandler(async ({userId , targetId , targetType}) =>{
    if(!isValidObjectId(targetId)){
        throw new ApiError (400 , "Invalid id format")
    }
    const existingLike = await Like.findOne({
        likedBy : userId , 
        [`${targetType}`] : targetId
    })

    if(existingLike){
        await existingLike.deleteOne();
        return {liked : false}
    }
    else{
        await Like.create({
            likedBy : userId,
            [`${targetType}`] : targetId
        });
        return {liked : true}
    }
})
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id

    const videoLike = asyncHandler(async ({userId , targetId : "videoid" , targetType : "video"}))

    return res
    .status(200)
    .json(new ApiResponse(200 , videoLike , `Video ${videoLike.liked? "liked" : "unliked"} successfully`))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user?._id

    const commentLike = asyncHandler(async ({userId , targetId : "commentId" , targetType : "comment"}))

    return res
    .status(200)
    .json(new ApiResponse(200 , commentLike , `Comment ${commentLike.liked? "liked" : "unliked"} successfully`))


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user?._id;

    const tweetLike = await toggleLike({ userId, targetId: tweetId, targetType: "tweet" });

    return res
        .status(200)
        .json(new ApiResponse(200, tweetLike, `Tweet ${tweetLike.liked ? "liked" : "unliked"} successfully`));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } })
        .populate("video");

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Fetched all liked videos successfully"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}