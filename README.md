# treehouse
> With an mp3 audio file, generate a translation to the language of choice.

This project includes a Node.js API that accepts audio files to be converted to text with Deepgram's STT, translated to the desireed language with Google Translate API, and processed through WellSaid Labs's TTS to generate audio. 

## Setup
1. Add .env file to the root directory
```
SERVER_PORT=8080
HOST_URL=http://localhost:8080
AUDIO_UPLOAD_DIR='audio'
MAX_CHARACTER_LIMIT=500

DEEPGRAM_API_KEY=YOUR-DP-KEY
GOOGLE_TRANSLATE_PROJECT_ID=YOUR--GCP-PROJECT-ID
WELLSAID_API_KEY=YOUR-WELLSAID-KEY
WELLSAID_API_ENDPOINT=https://api.wellsaidlabs.com/v1/tts/stream
```

2. Setup a Google Cloud Platform Project and Service Account to connect to Google Translate API. See the "Before You Begin" section: https://cloud.google.com/nodejs/docs/reference/translate/latest 

    Google Cloud Tips:
    -  When selecting a role for your service account, you can try Cloud Translation API Admin
    - To connect to GCP from your local machine, you can set the following environment variable "export GOOGLE_APPLICATION_CREDENTIALS={file_path_to_your_credentials.json}" since the google sdk will check this variable by default.

3. Setup API 

```
cd api
npm install
npm start
```

4. Setup UI

```
cd ui
npm install
npm run dev
```

5. (Optional) WellSaid TTS
If you have access to a WellSaid Developer account, make the following changes: 
In your api/.env file, add your WellSaid key. 

In ui/pages/index.tsx, on line 6, turn this flag to true, in order to use this feature: 
```
    const ENABLE_WELLSAID_TTS = true; 
```


## API
-----
POST /generate/translation 
Form Data: 
| Field | Data Type  | Details  |
| :---   | :- | :- |
| speech | File | (MP3 only) |
| originalLanguageCode | String | Language codes follow the [ISO 639 1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) |


Response: 
JSON
```
    {text: "translated text here"}
```
-----

POST /generate/audio 

Form Data: 
| Field | Data Type  | Details  |
| :---   | :- | :- |
| speech | File | (MP3 only) |
| originalLanguageCode | String | Language codes follow the [ISO 639 1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) |

Response: 
File (audio/mpeg)

-----

## Limits

Note: MAX_CHARACTER_LIMIT has a default setting but this can be replaced to your liking. It was meant to be mindful of incurring costs when using third party services.