import dotenv from "dotenv";
import express from 'express';
import path from "path";
import generate from './routes/generate'; 
import fs from 'fs'; 

dotenv.config();
const port = process.env.SERVER_PORT;
const app = express();

//Setup 
const dirPath = path.join(__dirname, '/services/wellsaid/output');
if(!fs.existsSync(dirPath)){
  fs.mkdirSync(dirPath); 
}

app.get('/', (req, res) => res.send('Speech Processing API'));

app.use('/api/generate', generate); 

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});