import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors';
import { UserController, TeamController, DashboardController, BotController} from "./controllers/index.js";
import {checkAuth} from "./utils/index.js";


mongoose.connect('mongodb+srv://redlien11111:roshanhasfolen11@hackaton.gmxmpov.mongodb.net/?retryWrites=true&w=majority')
.then(() => { console.log('DB connect')})
.catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/register', UserController.register);
app.post('/auth/login', UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/teams/register', checkAuth, TeamController.register);
app.get('/teams', TeamController.getAll);
app.get('/teams/:name', TeamController.getOne);

app.get('/dashboard/locations', DashboardController.locations);

app.get('/bot/match/:string', BotController.match);
app.get('/bot/questions', BotController.getAllQuestions);
app.post('/bot/questions', BotController.addQuestion);
app.post('/bot', BotController.addKey);

app.listen(4444, (err) =>{
    if(err){
        return console.log(err);
    }
    console.log('Server ok');
});

