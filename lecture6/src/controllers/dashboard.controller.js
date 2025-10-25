import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.params

    if(!userId){
        throw new ApiError(401 , "User unauthenticated")
    }
    
    // get total no. of videos
    const totalVideos = await Video.countDocuments({owner : userId})

    // get total no. of subscribers
    const totalSubscriptions = await Subscription.countDocuments({channel : userId})

    // get total likes and views on each video using pipeline
    const videoStats = await Video.aggregate([
        {
            $match:{
                owner : new mongoose.Schema.Types.ObjectId(userId)  //match videos owned by user
            }
        },
        {
            $lookup:{     //join with likes 
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            // Group all documents into one to calculate sums
            $group: {
                _id: null, 
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: { $size: "$likes" } } 
            }
        },
        {
            // Project the final fields
            $project: {
                _id: 0,
                totalViews: 1,
                totalLikes: 1
            }
        }
    ])
    // Extract stats, handling the case where the user has 0 videos
    const totalViews = videoStats[0]?.totalViews || 0;
    const totalLikes = videoStats[0]?.totalLikes || 0;

    // Compile all stats into a single object
    const stats = {
        totalSubscribers,
        totalVideos,
        totalViews,
        totalLikes
    };

    // Return the stats
    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Channel stats retrieved successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401 , "User not authenticated")
    }
    const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 }); // Sort by newest first

    // Handle case where no videos are found
    if (!videos || videos.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No videos found for this channel"));
    }

    // Return the list of videos
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos retrieved successfully"));
});

export {
    getChannelStats, 
    getChannelVideos
    }