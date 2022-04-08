import dotenv from "dotenv";
import { v2 } from '@google-cloud/translate'; 

dotenv.config();

const PROJECT_ID = process.env.GOOGLE_TRANSLATE_PROJECT_ID;

class CloudTranslate {
    translate: v2.Translate;
    constructor(){
        this.translate = new v2.Translate({ projectId: PROJECT_ID }); 
    }

    async translateFromText(text: string, languageCode: string) {
        try {
            const credentials = await this.translate.authClient.getCredentials();
            console.log('Found email: ', credentials?.client_email); 
        } 
        catch(err){
            console.error(err); 
            throw new Error("Failed to initialize google cloud translate api with credentials."); 
        }
      
        const [translation] = await this.translate.translate(text, languageCode);
        console.log(`Text: ${text}`);
        console.log(`Translation: ${translation}`);

        return translation; 
      }
}

export default CloudTranslate; 