import jwt   from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/User.js";

export const register = async (req,res) =>{
    try {
     const password =  req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
 
     try {
        const newUser = await userModel.findOne({ login: req.body.login }).exec();
    
        if (newUser) {
          res.status(409).json({ message: 'Пользователь с таким логином уже зарегистрирован' });
        } else {
            const doc = new userModel({
                firstName: req.body.firstName,
                secondName:req.body.secondName, 
                email: req.body.email,
                login: req.body.login,
                role: req.body.role,
                location: req.body.location,
                sex: req.body.sex,
                age: req.body.age,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash,
            });
        
            const user = await doc.save();
        
            const token = jwt.sign({
                _id: user._id,
            }, "haha123",{ expiresIn: "30d"});
        
            const {passwordHash, ...userData} = user.toJSON();
        
            res.json({
                ...userData,
                token,
            });
        }
      } catch (error) {
        console.error(error);
        res.status(400).end();
      }

 
    } catch (error) {
         res.status(500).json({
             message: "Ошибка регистрации", 
         })
    }
}
export const login = async (req,res) =>{
    try {
        const user = await userModel.findOne({login: req.body.login});
        
        if (!user){
            return res.status(401).json({
                message: "Пользователь не найден",
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(403).json({
                message: "Неверный логин или пароль",
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, "haha123",{ expiresIn: "30d"});

        const {passwordHash, ...userData} = user.toJSON();

        res.json({
            ...userData,
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: "Не удалось авторизоваться", 
        })
    }
}

export const getMe = async (req,res) => {
    try {
        const user = await userModel.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        const {passwordHash, ...userData} = user._doc;

        res.json(userData);

    } catch (error) {
        return res.status(500).json({
            message: 'Нет доступа',
        })
    }
}