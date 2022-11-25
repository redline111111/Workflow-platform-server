import teamModel from "../models/Team.js";

export const register = async (req,res) =>{
    try {
    const newTeam = await teamModel.findOne({ name: req.body.name }).exec();

    if (newTeam) {
        res.status(409).json({ message: 'Команда с таким названием уже зарегистрирован' });
    } else {
        const doc = new teamModel({
            name: req.body.name,
            members:req.body.members,
            leader:req.body.members,
            description: req.body.description,
            progress: req.body.progress,
            avatarUrl: req.body.avatarUrl,
         });
         
         const team = await doc.save();
         const teamData = team.toJSON();
     
         res.json(teamData);
    }
    } catch (error) {
         res.status(500).json({
             message: "Ошибка регистрации", 
         })
    }
}

export const getAll = async (req,res) => {
    try {
        const team = await teamModel.find().
        populate({path: 'members', select:'firstName secondName'}).
        populate({path: 'leader', select:'firstName secondName'}).
        exec();

        res.json(team);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Нет доступа',
        })
    }
}
export const getOne = async (req,res) => {
    try {
        const name = req.params.name;

        const team = await teamModel.findOne({name}).
        populate({path: 'members', select:'firstName secondName role'}).
        populate({path: 'leader', select:'firstName secondName'}).
        exec();

        res.json(team);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Нет доступа',
        })
    }
}