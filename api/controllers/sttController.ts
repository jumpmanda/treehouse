import dotenv from "dotenv";
import express from 'express'; 
import sttService from '../services/sttService';

dotenv.config();

const { MAX_CHARACTER_LIMIT } = process.env;

class sttController {
    speechToTextService: sttService; 
    constructor(){
        if(!MAX_CHARACTER_LIMIT){
        this.speechToTextService = new sttService(); 
        }
        else{
            this.speechToTextService = new sttService(parseInt(MAX_CHARACTER_LIMIT)); 
        }
    }

    getText = async (req: express.Request, res: express.Response, next: express.NextFunction) => {    
        const { originalLanguageCode } = req.body; 
        
        if(!originalLanguageCode)
            throw new Error('Please provide original language code.'); 
    
        console.log('Fetching speech...'); 
        console.log('Uploaded file name: ' + req.file?.filename); 
        const filePath = req.file?.path; 
        if(!filePath)
        {
            res.status(400).send('File not provided.'); 
            return;
        }
        
        const response = await this.speechToTextService.getText(filePath, originalLanguageCode); 
    
        if(!response || response === '')
            throw new Error('Failed to generate audio. Could not get transcript.')
    
        res.locals.transcript = response; 
        res.locals.languageCode = 'en'; // For now, we can only generate english audio 
    
        next(); 
    }; 
}

export default sttController; 