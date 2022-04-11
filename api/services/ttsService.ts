import WellSaidTTS from "./wellsaid/WellSaidTTS";

class ttsService
{ 
    constructor(){
        
    }

    async getTTS(text: string){
        console.log('Getting speech from text');
        try{
            // TODO: Determine what the best tts speaker should be
            return await WellSaidTTS.ttsRequestHandler(text, '3');     
        }
        catch(err){
            console.error(err); 
            throw new Error('Unexpected TTS error.'); 
        }
    }
}

export default ttsService; 