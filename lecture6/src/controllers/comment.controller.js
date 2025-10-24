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
    const {videoId} = req.params
    const {content} = req.params

    // validate videoID
    if(!mongoose.Schema.Types.ObjectId(videoId)){
        throw new ApiError(400 , "Video Id invalid")
    }

    // validate content

    if (!content || content.trim() === "") {
        throw new ApiError(400 , "Comments can't be empty")
    }

    // checking if video exists
    const video = await Video.findById(videoId)
        if(!video){
            throw new ApiError(400 , "The video does not exist")
        }

    // creating a comment object

    const comment = await Comment.create({
        content , 
        video : videoId,
        owner : req.user?._id
    })

    if(!comment){
        throw new ApiError(500 , "Failed to comment")
    }

    // return the created comment
    return res
    .status(201)
    .json(new ApiResponse(201 ,comment ,  "Comment added successfully"))


})

const updatedComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.params

    // validate commentId
    if(!mongoose.Schema.Types.ObjectId(commentId)){
        throw new ApiError(400 , "Invalid comment ID")
    }

    // validate content
    if(!content || content.trim() === "" ){
        throw new ApiError(400 , "Comments cant't be empty")
    }

    const comment  = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404 , "Comment to be updated not found")
    }

    // ensure if the user updating the comment is its owner 
    if(comment.owner.toString() !== req.user?._id.toString()){
        throw  new ApiError(403 , "You are not authorized to update this comment")
    }

    // update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId , 
        {
            $set:{
                content
            }
        },
        {
            new:true  //returns the newly updated comment
        }
    )
       
    if(!updatedComment){
        throw new ApiError (500 , "Failed to update the comment")
    }

    // return the updated comment
    return res
    .status(200)
    .json(new ApiResponse(200 , updatedComment , "Comment Updated Successfully"))
        
 })

const deleteComment = asyncHandler(async (req, res) => {
    // Get commentId from params
    const { commentId } = req.params;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    //  Ensure the user deleting the comment is the owner
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);


    // Return a success response
    return res
        .status(200)
        .json(new ApiResponse(200, { deletedCommentId: commentId }, "Comment deleted successfully"));
});

export {
    getVideoComments, 
    addComment, 
    updatedComment,
    deleteComment
    }