import React, {  useEffect, useState } from 'react'; 
import { Typography, Button, Select, InputLabel, MenuItem } from '@mui/material';
import loading from '../assets/loading.gif';
import icon from '../assets/icon.png'; 
import codes from '../data/iso-codes'; 

const ENABLE_WELLSAID_TTS = false; 

const Main = () => {
    const [isLoading, setLoading] = useState(false); 
    const [output, setOutput] = useState<string>(); 
    const [languageCode, setLanguageCode] = useState<number>(42); 
    const [uploadMessage, setUploadMessage] = useState<string>(); 
    const [uploadError, setUploadError] = useState<string>();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError(undefined); 
        const fileList = e.target.files; 
        const hasFile = fileList.length > 0;  
        if(!hasFile){
            setUploadError('Please upload 1 MP3 file to get started.'); 
            return; 
        }
        if(fileList.length > 1){
            setUploadError('Please upload only 1 file at a time.'); 
            return; 
        }
        const inputFile = fileList.item(0);       
        setUploadMessage(`File name: ${inputFile.name}, Size: ${inputFile.size}`);   
        sendRequest(inputFile);       
    }; 

    const sendRequest = async (inputFile: File) => {
        setOutput(undefined); 
        setLoading(true); 
        var data = new FormData();
        debugger;
        data.append('speech', inputFile);
        data.append('originalLanguageCode', codes[languageCode].code); 

        const requestOptions = {
            method: 'POST',
            mode: "no-cors" as RequestMode, 
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*' },
            body: data
        };
        const apiUrl = !ENABLE_WELLSAID_TTS ? '/api/generate/transcript': '/api/generate/audio';
        try{
            fetch(apiUrl, requestOptions)
            .then(async response => {
                if(!ENABLE_WELLSAID_TTS){
                    return response.json();  
                }
                else{
                    const blob = await response.blob(); 
                    const objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl);
                    setOutput(`Audio successfully generated! Make sure pop ups are allowed to access: ${objectUrl}`); 
                }
            })
            .then(data => {
                if(!ENABLE_WELLSAID_TTS){
                    const { text } = data;                      
                    setOutput(text); 
                }                
                setLoading(false);
            });
        }
        catch(err){
            setLoading(false); 
            setUploadError(`Server error.`);
            console.error(err); 
        }         
    };

    return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem'}}>
        <div>
            <img height={100} src={icon.src} alt={'Treehouse-icon'}/>
        <Typography variant="h3" component="h3">
        Treehouse
    </Typography>
    <Typography variant="subtitle1" gutterBottom component="div">
        1. Upload audio file
    </Typography>
    <Typography variant="subtitle1" gutterBottom component="div">
        2. Select language used in audio file
    </Typography>
    <Typography variant="subtitle1" gutterBottom component="div">
        3. Get output - either translated text or translated audio (if audio is available)
    </Typography>
    <div>
    <Typography variant="h6" component="h6">
        Please specify language of audio file:
        <InputLabel id="demo-simple-select-label">Language</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={languageCode}
            label="Language"
            onChange={(e)=>{
                setLanguageCode(e.target.value as number);  
            }}
        >
            {
                codes.map((codeData, index) => (<MenuItem key={`${index}-${codeData.code}`} value={index}>{codeData.name}</MenuItem>))
            }
        </Select>
    </Typography>
    </div>
    <span>
    <label htmlFor="upload-audio">
        <input
            style={{ display: 'none' }}
            id="upload-audio"
            name="upload-audio"
            type="file"
            onChange={handleChange}
        />
        <Button color="secondary" variant="contained" component="span">
            Upload Audio (MP3 Only)
        </Button>        
        <div>
            {uploadMessage}
        </div>
        <div>
            {uploadError}
        </div>
        {
            isLoading && <img src={loading.src} alt="loading..." height={100} />
        }
        <div style={{width: 400}}>
            {
                output
            }
        </div>
    </label>
    </span>
        </div>
    </div>); 
};

export default Main; 