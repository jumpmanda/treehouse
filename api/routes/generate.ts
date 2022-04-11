import dotenv from "dotenv";
import express from 'express'; 
import multer from 'multer'; 
import {v4} from 'uuid';
import sttController from "../controllers/sttController";
import TranslateController from "../controllers/translateController";
import ttsController from "../controllers/ttsController";

dotenv.config();

const fileExtensionRe = /(?:\.(?:mp3))?$/;

const storage = multer.diskStorage({
  destination: process.env.AUDIO_UPLOAD_DIR,
  filename: function(req, file, callback) {
    const results = fileExtensionRe.exec(file.originalname); 
    if(!results) callback(new Error('Wrong file type. Must be mp3.'), file.originalname); 
    else if(results && results.length > 0){
      const fileName = `${v4()}${results[0]}${v4()}${results[0]}`;
      callback(null, fileName);
        }
      
  }
});

const uploader = multer({ storage: storage }); 

const speechToTextCtrl = new sttController(); 
const translateCtrl = new TranslateController(); 
const ttsCtrl = new ttsController(); 

const router = express.Router();

router.post('/transcript', 
  uploader.single('speech'), 
  speechToTextCtrl.getText, 
  translateCtrl.translate,
  (req, res)=>{ 
    res.status(200).send({ text: res.locals.translatedText}) 
  }, 
); 

router.post('/audio', 
  uploader.single('speech'), 
  speechToTextCtrl.getText, 
  translateCtrl.translate,
  ttsCtrl.getTTS, 
); 

module.exports = router;

export default router; 