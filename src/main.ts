import * as dotenv from "dotenv";
import { Bot } from 'grammy';
import * as cron from 'node-cron';
import { getSheetData } from './handlers/sheets/GoogleSheets';

dotenv.config();

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot((process.env.TELEGRAM_API_KEY!)); // <-- put your bot token between the ""

async function sendDailyNotifications() {
  const chores = await getSheetData(); // Get the parsed data from Google Sheets
  const chatId = process.env.PETUNGUS_CHAT_ID!; // Replace with the ID of the chat where you want to send the message

  let message = `Hi everyone! Today is ${new Date().toLocaleDateString('pl-PL', { timeZone: 'Europe/Warsaw' })}. Here are the chores for today:\n\n`;
  for (const [chore, value] of Object.entries(chores)) {
    message += `*${chore}*: ${value.assignee}\n`;
  }

  await bot.api.sendMessage(chatId, message);
}

cron.schedule('0 9 * * *', sendDailyNotifications, {
  timezone: 'Europe/Warsaw',
});

// Start the bot
bot.start();