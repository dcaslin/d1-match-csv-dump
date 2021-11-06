"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var axios_1 = __importDefault(require("axios"));
var dotenv = __importStar(require("dotenv"));
var result = dotenv.config();
if (!process.env.D1_API_KEY) {
    console.error('API_KEY is not defined');
    process.exit(1);
}
if (!process.env.D1_PLATFORM) {
    console.error('D1_PLATFORM is not defined');
    process.exit(1);
}
if (!process.env.D1_ACCOUNT_ID) {
    console.error('D1_ACCOUNT_ID is not defined');
    process.exit(1);
}
var ax = axios_1.default.create({
    baseURL: 'https://www.bungie.net/',
    timeout: 10000,
    headers: { 'x-api-key': process.env.D1_API_KEY }
});
function makeRequest(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ax.get(url)];
                case 1:
                    response = _a.sent();
                    if (!response.data) {
                        throw new Error('No data returned');
                    }
                    if (!response.data.Response) {
                        throw new Error('No response returned');
                    }
                    if (response.data.ErrorCode !== 1) {
                        throw new Error("Error code " + response.data.ErrorCode + ", msg " + response.data.Message);
                    }
                    return [2 /*return*/, response.data.Response.data];
                case 2:
                    error_1 = _a.sent();
                    console.log("Failed request on url " + url + " with " + error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function parseMatch(characterId, characterClass, cache, a) {
    var aDesc = cache.Activity[a.activityDetails.referenceId];
    return {
        characterId: characterId,
        characterClass: characterClass,
        name: aDesc.activityName,
        date: a.period,
        humanDate: new Date(a.period).toLocaleString().replace(',', ' '),
        hash: a.activityDetails.instanceId,
        kills: a.values.kills.basic.value,
        assists: a.values.assists.basic.value,
        deaths: a.values.deaths.basic.value,
        result: a.values.completed.basic.displayValue,
        humanDuration: a.values.activityDurationSeconds.basic.displayValue,
        durationSeconds: a.values.activityDurationSeconds.basic.value,
    };
}
function csvHeader() {
    return "characterId,characterClass,name,date,humanDate,hash,kills,assists,deaths,completed,humanDuration,durationSeconds";
}
function matchToCsv(match) {
    return match.characterId + "," + match.characterClass + "," + match.name.replace(",", " ") + "," + match.date + "," + match.humanDate + "," + match.hash + "," + match.kills + "," + match.assists + "," + match.deaths + "," + match.result + "," + match.humanDuration + "," + match.durationSeconds;
}
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var sJson, cache, data, matches, _i, _b, charData, characterId, className, pageCntr, matchData, _c, _d, matchRaw, match, csv;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fs.readFileSync('./destiny.json', 'utf8')];
                case 1:
                    sJson = _e.sent();
                    cache = JSON.parse(sJson);
                    return [4 /*yield*/, makeRequest("/Platform/Destiny/" + process.env.D1_PLATFORM + "/Account/" + process.env.D1_ACCOUNT_ID + "/Summary/")];
                case 2:
                    data = _e.sent();
                    matches = [];
                    _i = 0, _b = data.characters;
                    _e.label = 3;
                case 3:
                    if (!(_i < _b.length)) return [3 /*break*/, 7];
                    charData = _b[_i];
                    characterId = charData.characterBase.characterId;
                    className = cache.Class[charData.characterBase.classHash].className;
                    console.log("Fetching PVP matches for " + className);
                    console.log(characterId + " " + className);
                    pageCntr = 0;
                    _e.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 6];
                    console.log("    - Fetching " + className + " page " + pageCntr);
                    return [4 /*yield*/, makeRequest("/Platform/Destiny/Stats/ActivityHistory/" + process.env.D1_PLATFORM + "/" + process.env.D1_ACCOUNT_ID + "/" + characterId + "/?count=100&mode=AllPve&page=" + pageCntr)];
                case 5:
                    matchData = _e.sent();
                    pageCntr++;
                    if (!(matchData === null || matchData === void 0 ? void 0 : matchData.activities) || (((_a = matchData === null || matchData === void 0 ? void 0 : matchData.activities) === null || _a === void 0 ? void 0 : _a.length) === 0)) {
                        return [3 /*break*/, 6];
                    }
                    // for testing if (pageCntr>1) break;
                    for (_c = 0, _d = matchData.activities; _c < _d.length; _c++) {
                        matchRaw = _d[_c];
                        match = parseMatch(characterId, className, cache, matchRaw);
                        matches.push(match);
                    }
                    return [3 /*break*/, 4];
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7:
                    // sort matches by date
                    matches.sort(function (a, b) {
                        if (a.date < b.date)
                            return -1;
                        if (a.date > b.date)
                            return 1;
                        return 0;
                    });
                    csv = matches.map(function (match) { return matchToCsv(match); }).join('\n');
                    // write csv to file
                    return [4 /*yield*/, fs.writeFileSync("matches.csv", csvHeader() + '\n' + csv)];
                case 8:
                    // write csv to file
                    _e.sent();
                    return [4 /*yield*/, fs.writeFileSync("matches.json", csvHeader() + '\n' + csv)];
                case 9:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
run();
