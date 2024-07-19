import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userIdFrom: { type: mongoose.Types.ObjectId, required: true, trim: true, ref: 'Auth' },
    userIdTo: { type: mongoose.Types.ObjectId, required: true, trim: true, ref: 'Auth' },
}, { timestamps: true, versionKey: false });

const friendsRequestSchema = mongoose.model('FriendsRequest', schema);

export default friendsRequestSchema;