import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userIdFrom: { type: mongoose.Types.ObjectId, required: true, trim: true },
    userIdTo: { type: mongoose.Types.ObjectId, required: true, trim: true },
}, { timestamps: true, versionKey: false });

const friendsRequestSchema = mongoose.model('FriendsRequest', schema);

export default friendsRequestSchema;