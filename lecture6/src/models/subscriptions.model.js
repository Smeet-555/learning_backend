import e from "express";
import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    sunscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true }, 
    }, { timestamps: true });


export const Subscription = mongoose.model('Subscription', subscriptionSchema);  