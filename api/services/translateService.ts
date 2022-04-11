import CloudTranslate from "./google-cloud/cloudTranslate";

class TranslateService {
    cloudTranslate: CloudTranslate; 
    constructor(){
        this.cloudTranslate = new CloudTranslate(); 
    }

    translate = async (text: string, languageCode: string) => {
        return await this.cloudTranslate.translateFromText(text, languageCode); 
    };
}

export default TranslateService; 

