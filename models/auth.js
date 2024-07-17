import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, 
    avatar: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    online: { type: Boolean, required: false, default: false },
}, { timestamps: true, versionKey: false });

const authSchema = mongoose.model('Auth', schema);

export default authSchema;