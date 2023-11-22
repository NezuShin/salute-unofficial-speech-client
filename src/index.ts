import axios from 'axios';
import * as crypyo from 'crypto'
import fs from 'fs'
import { Agent } from 'https';
import type { ReadableStream } from 'node:stream/web';
import path from 'path';

enum SberSaluteClientScope {
    SALUTE_SPEECH_CORP = 'SALUTE_SPEECH_CORP',
    SALUTE_SPEECH_PERS = 'SALUTE_SPEECH_PERS'
}

enum TTSAudioFormat {
    wav16 = 'wav16',
    pcm16 = 'pcm16',
    opus = 'opus'
}

enum TTSVoice {
    Nec_24000 = "Nec_24000",
    Nec_8000 = "Nec_8000",
    Bys_24000 = "Bys_24000",
    Bys_8000 = "Bys_8000",
    May_24000 = 'May_24000',
    May_8000 = "May_8000",
    Tur_24000 = "Tur_24000",
    Tur_8000 = "Tur_8000",
    Ost_24000 = "Ost_24000",
    Ost_8000 = "Ost_8000",
    Pon_24000 = "Pon_24000",
    Pon_8000 = "Pon_8000",
    Kin_24000 = "Kin_24000",
    Kin_8000 = "Kin_8000"
}

enum TextFormat {
    text = 'application/text',
    ssml = 'application/ssml'
}

enum STTLanguage {
    ru = "ru-RU",
    en = "en-US",
    kz = "kk-KZ"
}

enum STTAudioFormat {
    pcm_s16le = "audio/x-pcm",
    opus = "audio/ogg;codecs=opus",
    mp3 = "audio/mpeg",
    flac = "audio/flac",
    alaw = "audio/pcma",
    mulaw = "audio/pcmu"
}

interface SaluteToken {
    access_token: string,
    expires_at: number
}

interface SberSaluteClientSettings {
    clientSecret: string,
    scope?: SberSaluteClientScope,
    certPath?: string
    httpsAgent?: Agent
}

interface SaulteSTTEmotions {
    negative: number,
    neutral: number,
    positive: number
}

interface SaluteSTTOutput {
    result: string[],
    emotions: SaulteSTTEmotions[],
    status: number
}

interface SaluteSTTSettings {
    sampleRate?: number,
    enableProfanityFilter?: boolean,
    channelsCount?: number,
    language: STTLanguage,
    audioFormat: STTAudioFormat,
    bitDepth?: number,
}

class SberSaluteClient {

    private clientSecret: string;
    private scope: SberSaluteClientScope;
    private token: SaluteToken | undefined;
    private agent: Agent | undefined;
    constructor(settings: SberSaluteClientSettings) {
        this.clientSecret = settings.clientSecret;
        this.scope = settings.scope || SberSaluteClientScope.SALUTE_SPEECH_PERS;
        this.agent = settings.httpsAgent || (new Agent({
            ca: fs.readFileSync(settings.certPath || path.join(path.resolve(__dirname, '../'), 'russian_trusted_root_ca.pem'), { encoding: null }),
        }));
    }

    public async login() {
        if (!!this.token && this.token.expires_at < Date.now()) {
            return;
        }

        let response = await axios({
            method: 'post',
            httpsAgent: this.agent,
            url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            headers: {
                'RqUID': crypyo.randomUUID(),
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${this.clientSecret}`
            },
            data: `scope=${this.scope}`
        });

        this.token = response.data as SaluteToken;
    }

    public async streamingSynthesize(textFormat: TextFormat, audioFormat: TTSAudioFormat, voice: TTSVoice, text: string): Promise<ReadableStream<Buffer>> {
        await this.login();

        let response = await axios({
            method: 'post',
            httpsAgent: this.agent,
            url: 'https://smartspeech.sber.ru/rest/v1/text:synthesize',
            headers: {
                'Authorization': `Bearer ${this.token?.access_token}`,
                'Content-Type': `${textFormat}`
            },
            params: {
                format: audioFormat,
                voice: voice
            },
            data: text,
            responseType: 'stream'
        });


        return response.data as (ReadableStream<Buffer>);
    }

    public async synthesize(textFormat: TextFormat, audioFormat: TTSAudioFormat, voice: TTSVoice, text: string): Promise<Buffer> {
        let arr: Buffer[] = [];

        let stream = await this.streamingSynthesize(textFormat, audioFormat, voice, text);

        for await (let i of stream) {
            arr.push(i);
        }

        return Buffer.concat(arr);
    }

    private typesNeedRate: string[] = ['audio/x-pcm', 'audio/pcma', 'audio/pcmu'];

    private typesNeedBitDepth: string[] = ['audio/x-pcm'];

    public async recognize(audioData: Buffer, audioSettings: SaluteSTTSettings): Promise<SaluteSTTOutput> {
        await this.login();

        let audioFormat = audioSettings.audioFormat
        let audioFormatStr: string = audioFormat as string;

        if (this.typesNeedRate.includes(audioFormat)) {
            if (!audioSettings.sampleRate)
                throw new Error(`Audio type ${audioFormat} requires configure sampleRate, but it missing in settings`);
            audioFormatStr += `;rate=${audioSettings.sampleRate}`;
        }

        if (this.typesNeedBitDepth.includes(audioFormat)) {
            if (!audioSettings.bitDepth)
                throw new Error(`Audio type ${audioFormat} requires configure bitDepth, but it missing in settings`);
            audioFormatStr += `;bit=${audioSettings.bitDepth}`;
        }




        let response = await axios({
            method: 'post',
            httpsAgent: this.agent,
            url: 'https://smartspeech.sber.ru/rest/v1/speech:recognize',
            params: {
                language: audioSettings.language,
                sample_rate: audioSettings.sampleRate,
                enable_profanity_filter: audioSettings.enableProfanityFilter || false,
                channels_count: audioSettings.channelsCount || 1
            },
            headers: {
                'Authorization': `Bearer ${this.token?.access_token}`,
                'Content-Type': `${audioFormatStr}`
            },
            data: audioData,
            responseType: 'json'
        });

        return response.data as SaluteSTTOutput;
    }


}





export {
    SberSaluteClient,
    TTSAudioFormat,
    TTSVoice,
    TextFormat,
    SberSaluteClientScope,
    SberSaluteClientSettings,
    SaluteSTTSettings,
    STTAudioFormat,
    STTLanguage
}