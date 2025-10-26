import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const userId = req.user?._id

    if(!content || content.trim() === ""){
        throw new ApiError (400 , "Tweet can't be empty")
    }

    const tweet = await Tweet.create({
        content,
        owner : userId
    })
    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"));

})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400 , "Invalid userId")
    }
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Fetched user tweets successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body
    const userId = req.user?._id

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400 , "Invalid tweet id")
    }

    if(!content || content.trim() === ""){
        throw new ApiError (400 , "Tweet can't be empty")
    } 

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError (404 , "Tweet does not exist")
    }

    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError (403 , "You can only update your own tweets")
    }
    
    tweet.content = content;
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));

})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own tweets");
    }

    await tweet.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
