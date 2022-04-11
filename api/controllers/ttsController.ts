import express from 'express'; 
import fs from "fs";
import ttsService from '../services/ttsService';

class ttsController {
    ttsService: ttsService;
    ; 
    constructor(){
        this.ttsService = new ttsService(); 
    }

    getTTS = async (req: express.Request, res: express.Response) => {
        console.log('Starting request for translation...'); 
    
        // TODO: Remove later, but temporary check if service is up
        try {
            await this.ttsService.getTTS("hello world");
        }
        catch(err){
            res.status(500).send("Server error.");    
        }

        try {
            const text = res.locals.translatedText; 
            const result = await this.ttsService.getTTS(text); 
            const outputPath = result as string; 
            if(!outputPath || outputPath === "")
                throw new Error("Failed to get output file path from tts."); 
            console.log("Whooo file was generated!"); 
            res.status(200).sendFile(outputPath); 
        }
        catch(err){
            console.error(err); 
            res.status(500).send("Server error.");     
        }
    }; 
}

export default ttsController; 