import botModel from "../models/Bot.js";
import questionModel from "../models/Questions.js";

export const match = async (req,res) => {
    try {
        const keyWord = req.params.string;
        const strings = await botModel.find().exec();
        const qa = []
        
        function getCharacterLength(str) {
            str = str.split(' ');
            str = str.join('')
            return str.length;
        }
        function convertString(str){
            const reg = str.replace(/[^a-zа-яё\s]/gi, '').split(' ');
            return reg
        }
        function searchMatches(s1, s2){
            const strList = convertString(s1);
            const strList2 = convertString(s2);
            const match = [];
    
            for (let i = 0; i < strList.length; i++) {
                if(s2.includes(strList[i])){
                    match.push(strList[i]);
                }
            }
            const percentsOfMatch = [Math.trunc(match.length/strList.length * 100), Math.trunc(match.length/strList2.length * 100)]
            return percentsOfMatch;
        }
        function levenshtein(s1, s2, costs) {
            var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
            l1 = s1.length;
            l2 = s2.length;
        
            costs = costs || {};
            var cr = costs.replace || 1;
            var cri = costs.replaceCase || costs.replace || 1;
            var ci = costs.insert || 1;
            var cd = costs.remove || 1;
        
            cutHalf = flip = Math.max(l1, l2);
        
            var minCost = Math.min(cd, ci, cr);
            var minD = Math.max(minCost, (l1 - l2) * cd);
            var minI = Math.max(minCost, (l2 - l1) * ci);
            var buf = new Array((cutHalf * 2) - 1);
        
            for (i = 0; i <= l2; ++i) {
                buf[i] = i * minD;
            }
        
            for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
                ch = s1[i];
                chl = ch.toLowerCase();
        
                buf[flip] = (i + 1) * minI;
        
                ii = flip;
                ii2 = cutHalf - flip;
        
                for (j = 0; j < l2; ++j, ++ii, ++ii2) {
                    cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
                    buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
                }
            }
            const percent = Math.trunc(getCharacterLength(s2) * 0.40);
            const isOk = buf[l2 + cutHalf - flip] <= percent;
            return isOk;
        }
        for (let i = 0; i < strings.length; i++) {
            const str1 = keyWord.toLowerCase();
            const str2 = strings[i].data.toLowerCase();
            
            const percents = searchMatches(str1, str2);
            const diff = levenshtein(str1, str2);

            if(percents[0] > 50 || percents[1] > 50 || diff){
                console.log('Совпадения найдены!');
                qa.push({
                    question: strings[i].data,
                    answer: strings[i].answer
                })
            }
            else{
                console.log('Совпадений нет!');
            }
        }
        res.json(qa);

    } catch (error) {
        return res.status(500).json({
            message: 'Нет доступа',
        })
    }
}
export const addKey = async (req,res) => {
    try {
        const doc = new botModel({
            data: req.body.data,
            answer: req.body.answer,
        });
        
        const newKey = await doc.save();
        const keyData = newKey.toJSON();
    
        res.json(keyData);
    } catch (error) {
        res.status(500).json({
            message: "Ошибка регистрации", 
        })
    }
}
export const addQuestion = async (req,res) => {
    try {
        const doc = new questionModel({
            userDiscord: req.body.userDiscord,
            question: req.body.question,
        });
        
        const newQuestion = await doc.save();
        const questionData = newQuestion.toJSON();
    
        res.json(questionData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка регистрации", 
        })
    }
}
export const getAllQuestions = async (req,res) => {
    try {
        const question = await questionModel.find().exec();
        
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка регистрации", 
        })
    }
}