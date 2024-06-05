const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "7427826724:AAHNvNux6hDyZIQGRLPr3fnQg3dqWaNZXb4";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async chatId => {
  await bot.sendMessage(chatId, "I guess a number from 0 to 9. You should reveal it");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Guess my number: ", gameOptions);
};

const startChat = () => {
  bot.setMyCommands([
    { command: "/start", description: "Initial greeting" },
    { command: "/info", description: "Info about chat and user name" },
    { command: "/game", description: "Guess number game" },
  ]);

  bot.on("message", async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    switch (text) {
      case "/start": {
        await bot.sendSticker(chatId, `https://sl.combot.org/programmingmini_stickerex/webp/0xf09f94b4.webp`);
        return bot.sendMessage(chatId, "Wllcome to my first chat bot.");
      }
      case "/info": {
        return bot.sendMessage(chatId, `Hello my name is Oleksii Bielikov. Your name is ${msg.from.first_name} ${msg.from.last_name}`);
      }
      case "/game": {
        return startGame(chatId);
      }
      default: {
        return bot.sendMessage(chatId, "Command wasn't recognized");
      }
    }
  });

  bot.on("callback_query", async msg => {
    const {
      data,
      message: {
        chat: { id: chatId },
      },
    } = msg;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (+data === chats[chatId]) {
      return bot.sendMessage(chatId, `You guessed my number ${chats[chatId]}!!! Congratulations!!!`, againOptions);
    } else {
      return bot.sendMessage(chatId, `No. It isn't ${data}. Bot guessed ${chats[chatId]}`, againOptions);
    }
  });
};

startChat();
