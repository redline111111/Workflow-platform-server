import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
    data:String,
    answer:String,
},
{
    timestamps: true,
});


export default mongoose.model('Bot', botSchema);