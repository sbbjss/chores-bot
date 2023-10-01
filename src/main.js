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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const cron = __importStar(require("node-cron"));
const express_1 = __importDefault(require("express"));
const grammy_1 = require("grammy");
const GoogleSheets_1 = require("./handlers/sheets/GoogleSheets");
dotenv.config();
const app = (0, express_1.default)();
app.listen(8080, () => {
    console.log('Server is running on port 8080 🚀');
});
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot((process.env.TELEGRAM_API_KEY)); // <-- put your bot token between the ""
function sendDailyNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        const chores = yield (0, GoogleSheets_1.getSheetData)(); // Get the parsed data from Google Sheets
        const chatId = process.env.PETUNGUS_CHAT_ID; // Replace with the ID of the chat where you want to send the message
        let message = `Hi everyone! Today is ${new Date().toLocaleDateString('pl-PL', { timeZone: 'Europe/Warsaw' })}. Here are the chores for today:\n\n`;
        for (const [chore, value] of Object.entries(chores)) {
            message += `*${chore}*: ${value.assignee}\n`;
        }
        yield bot.api.sendMessage(chatId, message);
    });
}
cron.schedule('0 9 * * *', sendDailyNotifications, {
    timezone: 'Europe/Warsaw',
});
// Start the bot
bot.start();
