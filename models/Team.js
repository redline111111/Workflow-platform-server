import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description:String,
    progress: {
        stageName: String,
        stageResult: Number,
    },
    avatarUrl: String,
},
{
timestamps: true,
});


export default mongoose.model('Team', teamSchema);