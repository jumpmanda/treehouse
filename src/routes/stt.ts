import dotenv from "dotenv";
import express from 'express'; 
import multer from 'multer'; 
import {v4} from 'uuid';
import sttController from "../controllers/sttController";
import TranslateController from "../controllers/translateController";

dotenv.config();

const fileExtensionRe = /(?:\.(?:mp3))?$/;

const storage = multer.diskStorage({
  destination: process.env.AUDIO_UPLOAD_DIR,
  filename: function(req, file, callback) {
    const results = fileExtensionRe.exec(file.originalname); 
    if(!results) callback(new Error('Wrong file type. Must be mp3.'), file.originalname); 
    else if(results && results.length > 0)
      callback(null, `${v4()}${results[0]}`);
  }
});

const uploader = multer({ storage: storage }); 

const speechToTextCtrl = new sttController(); 
const translateCtrl = new TranslateController(); 

const router = express.Router();

router.post('/', 
  uploader.single('speech'), 
  speechToTextCtrl.getText, 
  translateCtrl.translate
); 

module.exports = router;

export default router; 