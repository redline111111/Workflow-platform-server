import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    secondName:{
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    location:{
        city: String,
        lat: Number,
        lon: Number,
    },
    isAdmin:Boolean,
    role: String,
    sex: String,
    age: Number,
    avatarUrl: String,
},
{
timestamps: true,
});


export default mongoose.model('User', userSchema);