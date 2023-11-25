"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STTLanguage = exports.STTAudioFormat = exports.SberSaluteClientScope = exports.TextFormat = exports.TTSVoice = exports.TTSAudioFormat = exports.SberSaluteClient = void 0;
const axios_1 = __importDefault(require("axios"));
const crypyo = __importStar(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const https_1 = require("https");
const path_1 = __importDefault(require("path"));
var SberSaluteClientScope;
(function (SberSaluteClientScope) {
    SberSaluteClientScope["SALUTE_SPEECH_CORP"] = "SALUTE_SPEECH_CORP";
    SberSaluteClientScope["SALUTE_SPEECH_PERS"] = "SALUTE_SPEECH_PERS";
})(SberSaluteClientScope || (exports.SberSaluteClientScope = SberSaluteClientScope = {}));
var TTSAudioFormat;
(function (TTSAudioFormat) {
    TTSAudioFormat["wav16"] = "wav16";
    TTSAudioFormat["pcm16"] = "pcm16";
    TTSAudioFormat["opus"] = "opus";
})(TTSAudioFormat || (exports.TTSAudioFormat = TTSAudioFormat = {}));
var TTSVoice;
(function (TTSVoice) {
    TTSVoice["Nec_24000"] = "Nec_24000";
    TTSVoice["Nec_8000"] = "Nec_8000";
    TTSVoice["Bys_24000"] = "Bys_24000";
    TTSVoice["Bys_8000"] = "Bys_8000";
    TTSVoice["May_24000"] = "May_24000";
    TTSVoice["May_8000"] = "May_8000";
    TTSVoice["Tur_24000"] = "Tur_24000";
    TTSVoice["Tur_8000"] = "Tur_8000";
    TTSVoice["Ost_24000"] = "Ost_24000";
    TTSVoice["Ost_8000"] = "Ost_8000";
    TTSVoice["Pon_24000"] = "Pon_24000";
    TTSVoice["Pon_8000"] = "Pon_8000";
    TTSVoice["Kin_24000"] = "Kin_24000";
    TTSVoice["Kin_8000"] = "Kin_8000";
})(TTSVoice || (exports.TTSVoice = TTSVoice = {}));
var TextFormat;
(function (TextFormat) {
    TextFormat["text"] = "application/text";
    TextFormat["ssml"] = "application/ssml";
})(TextFormat || (exports.TextFormat = TextFormat = {}));
var STTLanguage;
(function (STTLanguage) {
    STTLanguage["ru"] = "ru-RU";
    STTLanguage["en"] = "en-US";
    STTLanguage["kz"] = "kk-KZ";
})(STTLanguage || (exports.STTLanguage = STTLanguage = {}));
var STTAudioFormat;
(function (STTAudioFormat) {
    STTAudioFormat["pcm_s16le"] = "audio/x-pcm";
    STTAudioFormat["opus"] = "audio/ogg;codecs=opus";
    STTAudioFormat["mp3"] = "audio/mpeg";
    STTAudioFormat["flac"] = "audio/flac";
    STTAudioFormat["alaw"] = "audio/pcma";
    STTAudioFormat["mulaw"] = "audio/pcmu";
})(STTAudioFormat || (exports.STTAudioFormat = STTAudioFormat = {}));
class SberSaluteClient {
    constructor(settings) {
        this.typesNeedRate = ['audio/x-pcm', 'audio/pcma', 'audio/pcmu'];
        this.typesNeedBitDepth = ['audio/x-pcm'];
        this.clientSecret = settings.clientSecret;
        this.scope = settings.scope || SberSaluteClientScope.SALUTE_SPEECH_PERS;
        this.agent = settings.httpsAgent || (new https_1.Agent({
            ca: fs_1.default.readFileSync(settings.certPath || path_1.default.join(path_1.default.resolve(__dirname, '../'), 'russian_trusted_root_ca.pem'), { encoding: null }),
        }));
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this.token && this.token.expires_at > Date.now()) {
                return;
            }
            let response = yield (0, axios_1.default)({
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
            this.token = response.data;
        });
    }
    streamingSynthesize(textFormat, audioFormat, voice, text) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.login();
            let response = yield (0, axios_1.default)({
                method: 'post',
                httpsAgent: this.agent,
                url: 'https://smartspeech.sber.ru/rest/v1/text:synthesize',
                headers: {
                    'Authorization': `Bearer ${(_a = this.token) === null || _a === void 0 ? void 0 : _a.access_token}`,
                    'Content-Type': `${textFormat}`
                },
                params: {
                    format: audioFormat,
                    voice: voice
                },
                data: text,
                responseType: 'stream'
            });
            return response.data;
        });
    }
    synthesize(textFormat, audioFormat, voice, text) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let arr = [];
            let stream = yield this.streamingSynthesize(textFormat, audioFormat, voice, text);
            try {
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                    _c = stream_1_1.value;
                    _d = false;
                    let i = _c;
                    arr.push(i);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Buffer.concat(arr);
        });
    }
    recognize(audioData, audioSettings) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.login();
            let audioFormat = audioSettings.audioFormat;
            let audioFormatStr = audioFormat;
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
            let response = yield (0, axios_1.default)({
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
                    'Authorization': `Bearer ${(_a = this.token) === null || _a === void 0 ? void 0 : _a.access_token}`,
                    'Content-Type': `${audioFormatStr}`
                },
                data: audioData,
                responseType: 'json'
            });
            return response.data;
        });
    }
}
exports.SberSaluteClient = SberSaluteClient;
//# sourceMappingURL=index.js.map