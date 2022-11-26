import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    userDiscord:{
        type:String,
        required:true
    },
    question:{
        type:String,
        required:true
    },
},
{
    timestamps: true,
});


export default mongoose.model('question', questionSchema);