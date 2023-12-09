# salute-unofficial-speech-client
This is a simple wrapper between nodejs and sber.ru http api

##Usage
Synthesize speech:
```javascript
const { SberSaluteClient } = require('salute-unofficial-speech-client');
const fs = require('fs');
const client = new SberSaluteClient({
    clientSecret: 'NWFlMzI1MTgtNzkzNy00OGNhLWFiMTMtODUyNmFiNDVlZmJjOjZmMzA1MzdkLWJmMTEtNDhlMS1iYjA2LTlkZTVjZGI4ZDc3ZQ=='
});

(async () => {

    let audio = await client.synthesize('Hello. It is example!', {
        voice: 'Bys_24000'
    });

    fs.writeFileSync('./audio.wav', audio, {encoding: null});
})();
```

Streaming synthesize speech:
```javascript
const { SberSaluteClient } = require('salute-unofficial-speech-client');
const fs = require('fs');
const client = new SberSaluteClient({
    clientSecret: 'NWFlMzI1MTgtNzkzNy00OGNhLWFiMTMtODUyNmFiNDVlZmJjOjZmMzA1MzdkLWJmMTEtNDhlMS1iYjA2LTlkZTVjZGI4ZDc3ZQ=='
});

(async () => {

    let audio = await client.streamingSynthesize('Hello. It is example!', {
        voice: 'Bys_24000'
    });
    
    for await (let audioChunk of audio){
        console.log(`Got chunk with length ${audioChunk.length}`)
        fs.appendFileSync('./audio.wav', audioChunk, {encoding: null});
    }
})();
```
Recognize speech from audio:
```javascript
const { SberSaluteClient } = require('salute-unofficial-speech-client');
const fs = require('fs');
const client = new SberSaluteClient({
    clientSecret: 'NWFlMzI1MTgtNzkzNy00OGNhLWFiMTMtODUyNmFiNDVlZmJjOjZmMzA1MzdkLWJmMTEtNDhlMS1iYjA2LTlkZTVjZGI4ZDc3ZQ=='
});

(async () => {

    let audio = fs.readFileSync('./audio.mp3', { encoding: null });

    let response = await client.recognize(audio, {
        audioFormat: 'audio/mpeg',
        language: 'en-EN',
        enableProfanityFilter: false
    });
    console.log(response);
    /*{
        result: ['Hello. It is example.'],
        emotions: [
            {
                negative: 0.00041059262,
                neutral: 0.99900067,
                positive: 0.00058874494
            }
        ],
        status: 200
    }*/
})();
```
