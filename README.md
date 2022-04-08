# treehouse
> With an mp3 audio file, generate a new audio file translated to the language of choice.

This project includes a Node.js API that accepts audio files to be converted to text with Deepgram's STT, translated to the desireed language with Google Translate API, and processed through WellSaid Labs's TTS to generate audio. 

## Setup
1. Add .env file to the root directory
```
SERVER_PORT=8080
HOST_URL=http://localhost:8080

AUDIO_UPLOAD_DIR='src/audio'
DEEPGRAM_API_KEY=YOUR-DEEPGRAM-KEY-HERE
GOOGLE_TRANSLATE_PROJECT_ID=YOUR-GCP-PROJECT-ID-HERE
```

2. Setup a Google Cloud Platform Project and Service Account to connect to Google Translate API. See the "Before You Begin" section: https://cloud.google.com/nodejs/docs/reference/translate/latest 

    Google Cloud Tips:
    -  When selecting a role for your service account, you can try Cloud Translation API Admin
    - To connect to GCP from your local machine, you can set the following environment variable "export GOOGLE_APPLICATION_CREDENTIALS={file_path_to_your_credentials.json}" since the google sdk will check this variable by default.

3. npm install

4. npm start

## API (WIP)

POST /stt 

speech: file .mp3
originalLanguageCode: string
targetLanguageCode: string

Language codes follow the [ISO 639 1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)