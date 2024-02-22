const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
const { Telegraf } = require("telegraf")
const bot = new Telegraf(process.env.botToken)

const { mainChannelId } = require("./ids.json")

const inline_keyboard = [[], []]

var channels = {
    "до 5000": "https://t.me/+XQ_usEm8buw2YTIy",
    "5 000 - 10 000": "https://t.me/+Bw9tgPl4vbg4MGVi",
    "10 000 - 20 000": "https://t.me/+c2PPBDON3gZmMmIy",
    "Свыше 20 000": "https://t.me/+7F50AmoBuZAzMDI6"
}

for (var channel in channels)
{
    console.log(channel.substring(3))
    const button = {
        text: channel, url: channels[channel]
    }
    inline_keyboard[inline_keyboard[0].length < 2 ? 0 : 1].push(button)
}

inline_keyboard.push([{ text: "➕️ подать объявление", url: "https://t.me/auto312bot"}])

bot.telegram.sendMessage(mainChannelId, "Выберите цену $", { reply_markup: { inline_keyboard } }).catch(err => console.log(err))