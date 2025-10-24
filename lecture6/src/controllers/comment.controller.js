import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError (400  , "Invalid video ID")
    }

    // checking if video exists or not
    const video  = await Video.findById(videoId)
    if (!video){
        throw new ApiError (404 , "Video not found")
    }

    // Aggregation pipeline
    const commentAggregate = Comment.aggregate([
        {
            $match :{
                video : new mongoose.Schema.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails",
                pipeline : [
                    {
                        $project:{
                            username:1 ,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from : "likes",
                localField : "_id",
                foreignField : "comment",
                as : "likes"
            }
        },
        {
            $addFields:{
                owner : {$first : "ownerDetails"},
                likesCount : {$size : "$likes"},
                isLiked :{
                    $cond:{
                        if : {$in : [req.user?._id , "$liks.likedBy"],
                        then : true,
                        else : false
                        }
                    }
                }
            }
        },{
            $project:{
                content : 1,
                createdAt : 1,
                owner : 1,
                likesCount :1,
                isLiked : 1
            }
        },
        {
            $sort:{
                createdAt : -1    //sort in latest to oldest
            }
        }
    ]) ; 

        // Aggregation and Pagination
    const options = {
        page : parseInt(page , 10),
        limit : parseInt(page , 10)
    };

    const comments = await Comment.aggregatePaginate(commentAggregate , options)

    if(!comments || comments.docs.length === 0){
        return res
        .status(200)
        .json(new ApiResponse(200  , "No comments found on this video"))
    }

    return res
    .status(200)
    .json(new ApiResponse (200, "Comments retrieved successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }