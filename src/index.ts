import dotenv from "dotenv";
import express from 'express';
import stt from './routes/stt'; 

dotenv.config();
const port = process.env.SERVER_PORT;
const app = express();


app.get('/', (req, res) => res.send('Speech Processing API'));

app.use('/stt', stt); 

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});