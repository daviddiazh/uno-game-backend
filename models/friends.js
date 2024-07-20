import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    
}, { timestamps: true, versionKey: false });

const friendsSchema = mongoose.model('Friends', schema);

export default friendsSchema;