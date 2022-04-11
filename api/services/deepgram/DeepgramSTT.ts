import dotenv from "dotenv";
import { Deepgram } from '@deepgram/sdk'; 
dotenv.config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

class DeepgramSTT {
    _STT: Deepgram; 
    constructor(){
        if(!deepgramApiKey)
            throw new Error('Must provide Deepgram API Key.')
        this._STT = new Deepgram(deepgramApiKey); 
    }

    getText(input: {
        buffer: Buffer;
        mimetype: string;
    }, language: string){
        console.log('Requesting transcript...')
        console.log('Your file may take up to a couple minutes to process.')

        return this._STT.transcription.preRecorded(
        input,
        { punctuate: true, language },
        ); 
    }
}

export default DeepgramSTT; 