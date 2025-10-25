import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a subscription toggler
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (subscriberId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    if (existingSubscription) {
        await existingSubscription.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
    } else {
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });
        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"));
    }
});


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username email avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Fetched all subscribers successfully"));
});


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username email avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannels, "Fetched subscribed channels successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
