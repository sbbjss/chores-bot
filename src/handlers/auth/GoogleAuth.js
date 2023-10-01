"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const path_1 = __importDefault(require("path"));
const local_auth_1 = require("@google-cloud/local-auth");
const googleapis_1 = require("googleapis");
const fs = require('fs').promises;
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path_1.default.resolve(__dirname, 'token.json');
const CREDENTIALS_PATH = path_1.default.resolve(__dirname, 'credentials.json');
/**
 * Reads previously authorized credentials from the save file.
 */
function loadSavedCredentialsIfExist() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(token);
            return googleapis_1.google.auth.fromJSON(credentials);
        }
        catch (err) {
            return null;
        }
    });
}
/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 */
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.refreshAccessToken(),
        });
        yield fs.writeFile(TOKEN_PATH, payload);
    });
}
/**
 * Load or request or authorization to call APIs.
 */
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        let client = yield loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        // @ts-ignore
        client = yield (0, local_auth_1.authenticate)({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client === null || client === void 0 ? void 0 : client.credentials) {
            yield saveCredentials(client);
        }
        return client;
    });
}
exports.authorize = authorize;
