import dotenv from "dotenv";
import fs, { mkdir } from "fs";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import {v4} from 'uuid';
import path from "path";

dotenv.config();

const { WELLSAID_API_KEY, WELLSAID_API_ENDPOINT } = process.env;

// See https://developer.wellsaidlabs.com
/*** * Sample request handler for interacting with the WellSaid Labs TTS api. This is meant as a reference
 * * and not a library or usable code.
  *
  * The API request requires authentication via the "X-Api-Key" header.
  * The API request requires a JSON body payload with the following arguments:
  *   {
  *      "speaker_id": number
  *      "text": string
  *   }
  * There is currently a limit of 1000 characters on the "text" being rendered in a single request.
  *
  * The API response will be a stream of the generated audio file.
  *
  */
 async function ttsRequestHandler(text: string, speakerId: string) {
   /**
    * In certain scenarios a request from the client may timeout before the response
    * has been completed. For this reason we recommend the use of `AbortController` to
    * propagate this timeout or cancel the request and free up network resources.
    */
   if(!WELLSAID_API_KEY)
    throw new Error('Failed to get WellSaid TTS API Key.'); 

    if(!WELLSAID_API_ENDPOINT)
      throw new Error('Failed to get Wellsaid API Endpoint.'); 

  // const homedir = require('os')
  
  // mkdir(require('path').join(homedir, 'output'), (err) => {
  //   if(err)
  //   {
  //     console.error(`Failed to setup output directory. ${err.message}`); 
  //     throw new Error("Failed to setup output directory."); 
  //   }
  // });

   const ttsAbortController = new AbortController();
   let ttsResponse;
   try {
     ttsResponse = await fetch(WELLSAID_API_ENDPOINT, {
       signal: ttsAbortController.signal,
       method: "POST",
       headers: {
         "Accept": "audio/mpeg", 
         "Content-Type": "application/json",
         "X-Api-Key": WELLSAID_API_KEY
       },
       body: JSON.stringify({
         speaker_id: speakerId,
         text
       })
     });
   } catch (error) {
     // Most likely a network related error
     throw new Error("Service is currently unavailable");
   }

   if (!ttsResponse.ok) {
     /**
      * The TTS request failed with an error. Attempt to parse the error message from the response.
      */
     let errorMessage = "Failed to render";
     console.error("TTS Request failed."); 
     try {
       const { message } = await ttsResponse.json();
       errorMessage = message;
     } catch (error) {}
     throw new Error(errorMessage);
   }

   /**
    * We can now handle the TTS response. This is a streamed response that we will store to disk for
    * example purposes. Note that we can pipe this stream to multiple locations, for example both
    * the client and storage.
    */
   const generatedFileName = `${v4()}.mp3`; 
   const outputPath = path.join(__dirname, 'output', generatedFileName); 
   const storageWriteStream = fs.createWriteStream(outputPath, { flags: 'a+'});
   ttsResponse.body.pipe(storageWriteStream);
   
   try {
     return await new Promise((resolve, reject) => {
       storageWriteStream.on("finish", ()=>{
         resolve(outputPath); 
       });
       storageWriteStream.on("error", reject);
     });
   } catch (error) {
     /**
      * An error occurred while writing to disk, this is a good example of when we might abort the TTS
      * request.
      */
     console.error("Error generating TTS."); 
     ttsAbortController.abort();
     throw error;
   }
 }

 export default { ttsRequestHandler }; 


 

 