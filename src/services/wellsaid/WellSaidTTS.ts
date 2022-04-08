import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";
import AbortController from "abort-controller";

dotenv.config();

const { WELLSAID_API_KEY } = process.env;

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

   const ttsAbortController = new AbortController();
   const ttsEndPoint = "https://api.wellsaidlabs.com/v1/tts/stream";
   let ttsResponse;
   try {
     ttsResponse = await fetch(ttsEndPoint, {
       signal: ttsAbortController.signal,
       method: "POST",
       headers: {
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
 ​
   if (!ttsResponse.ok) {
     /**
      * The TTS request failed with an error. Attempt to parse the error message from the response.
      */
     let errorMessage = "Failed to render";
     try {
       const { message } = await ttsResponse.json();
       errorMessage = message;
     } catch (error) {}
     throw new Error(errorMessage);
   }
 ​
   /**
    * At this point we have a successful response and can begin processing/storing. If forwarding
    * this request to the client, you will need to pass along the headers describing the content
    * type etc. This is what forwarding the headers might look like in an express response:
    *
    *   response.writeHead(ttsResponse.status, ttsResponse.headers.raw());
    *   response.flushHeaders();
    */
   const contentType = ttsResponse.headers.get("Content-Type");
 ​
   /**
    * We can now handle the TTS response. This is a streamed response that we will store to disk for
    * example purposes. Note that we can pipe this stream to multiple locations, for example both
    * the client and storage.
    */
   const storageWriteStream = fs.createWriteStream("/tmp/somerandomfile");
   ttsResponse.body.pipe(storageWriteStream);
 ​
   try {
     await new Promise((resolve, reject) => {
       storageWriteStream.on("finish", resolve);
       storageWriteStream.on("error", reject);
     });
   } catch (error) {
     /**
      * An error occurred while writing to disk, this is a good example of when we might abort the TTS
      * request.
      */
     ttsAbortController.abort();
     throw error;
   }
 }

 export default { ttsRequestHandler }; 


 

 