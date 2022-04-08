import express from 'express'; 
import TranslateService from '../services/translateService';

class TranslateController {
    translateService: TranslateService; 
    constructor(){
        this.translateService = new TranslateService(); 
    }

    translate = async (req: express.Request, res: express.Response) => {
        console.log('Starting request for translation...'); 
    
        try {
            const transcript = res.locals.transcript;
            const languageCode = res.locals.languageCode; 
            if(!transcript || !languageCode) throw new Error('Failed to retrieve inputs for translation.');
    
            console.log('Translating to ', languageCode); 
            console.log('recieved transcript ', transcript); 
   
            const text = await this.translateService.translate(transcript, languageCode); 
            res.send({ text }); 
        }
        catch(err){
            console.error(err); 
            return 'Server error!';     
        }
    }; 
}

export default TranslateController; 