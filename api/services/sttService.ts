import DeepgramSTT from "./deepgram/DeepgramSTT";
import { readFile } from 'fs/promises'; 

class sttService
{
    _STT: DeepgramSTT; 
    _maxCharacterLimit?: number;
    constructor(maxCharacterLimit?: number){
        this._STT = new DeepgramSTT(); 
        this._maxCharacterLimit = maxCharacterLimit; 
    }

    async getText(audioFilePath: string, language: string){
        console.log('Getting text from audio file.');
        try{

        const audioSource = await readFile(audioFilePath); 

        const response = await this._STT.getText({ buffer: audioSource, mimetype: 'audio/mpeg'}, language);

        const channels = response.results?.channels; 
        if(channels){
            const alternatives = channels.flatMap(channel => channel.alternatives);
            const transcripts = alternatives?.map(alternative => alternative.transcript);

            let result = transcripts.join(''); 
            if(this._maxCharacterLimit){
                result = result.substring(0, this._maxCharacterLimit);
            }
            return result; 
        }
        }
        catch(err){
            console.error(err); 
            throw new Error('Unexpected STT error.'); 
        }
    }
}

export default sttService; 