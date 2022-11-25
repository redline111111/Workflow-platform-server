import userModel from "../models/User.js";

export const locations = async (req,res) => {
    try {
        const cities = await userModel.find({},{location: 1}).exec();
        

        if(!cities){
            return res.status(404).json({
                message: 'Города не найдены',
            })
        }

        const citiesData = cities.map(item => item.location)
        res.json(citiesData);

    } catch (error) {
        return res.status(500).json({
            message: 'Нет доступа',
        })
    }
}