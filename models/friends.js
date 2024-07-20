import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema({
    usersId: { type: [Schema.Types.ObjectId], required: true, trim: true, ref: 'Auth' },
}, { timestamps: true, versionKey: false });

const friendsSchema = mongoose.model('Friends', schema);

export default friendsSchema;