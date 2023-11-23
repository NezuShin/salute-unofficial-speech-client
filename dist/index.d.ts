/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Agent } from 'https';
import type { ReadableStream } from 'node:stream/web';
declare enum SberSaluteClientScope {
    SALUTE_SPEECH_CORP = "SALUTE_SPEECH_CORP",
    SALUTE_SPEECH_PERS = "SALUTE_SPEECH_PERS"
}
declare enum TTSAudioFormat {
    wav16 = "wav16",
    pcm16 = "pcm16",
    opus = "opus"
}
declare enum TTSVoice {
    Nec_24000 = "Nec_24000",
    Nec_8000 = "Nec_8000",
    Bys_24000 = "Bys_24000",
    Bys_8000 = "Bys_8000",
    May_24000 = "May_24000",
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
declare enum TextFormat {
    text = "application/text",
    ssml = "application/ssml"
}
declare enum STTLanguage {
    ru = "ru-RU",
    en = "en-US",
    kz = "kk-KZ"
}
declare enum STTAudioFormat {
    pcm_s16le = "audio/x-pcm",
    opus = "audio/ogg;codecs=opus",
    mp3 = "audio/mpeg",
    flac = "audio/flac",
    alaw = "audio/pcma",
    mulaw = "audio/pcmu"
}
interface SberSaluteClientSettings {
    clientSecret: string;
    scope?: SberSaluteClientScope;
    certPath?: string;
    httpsAgent?: Agent;
}
interface SaulteSTTEmotions {
    negative: number;
    neutral: number;
    positive: number;
}
interface SaluteSTTOutput {
    result: string[];
    emotions: SaulteSTTEmotions[];
    status: number;
}
interface SaluteSTTSettings {
    sampleRate?: number;
    enableProfanityFilter?: boolean;
    channelsCount?: number;
    language: STTLanguage;
    audioFormat: STTAudioFormat;
    bitDepth?: number;
}
declare class SberSaluteClient {
    private clientSecret;
    private scope;
    private token;
    private agent;
    constructor(settings: SberSaluteClientSettings);
    login(): Promise<void>;
    streamingSynthesize(textFormat: TextFormat, audioFormat: TTSAudioFormat, voice: TTSVoice, text: string): Promise<ReadableStream<Buffer>>;
    synthesize(textFormat: TextFormat, audioFormat: TTSAudioFormat, voice: TTSVoice, text: string): Promise<Buffer>;
    private typesNeedRate;
    private typesNeedBitDepth;
    recognize(audioData: Buffer, audioSettings: SaluteSTTSettings): Promise<SaluteSTTOutput>;
}
export { SberSaluteClient, TTSAudioFormat, TTSVoice, TextFormat, SberSaluteClientScope, SberSaluteClientSettings, SaluteSTTSettings, STTAudioFormat, STTLanguage };
//# sourceMappingURL=index.d.ts.map