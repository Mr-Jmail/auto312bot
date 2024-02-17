const { Telegraf } = require("telegraf")
const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const bot = new Telegraf(process.env.botToken)

const channelId = 2094018017

const souperGroupId = 2111110902

const inline_keyboard = [[], []]

const topics = {
    "до 5000": 1,
    "5000 - 10000": 3,
    "10 000-20 000": 4,
    "Свыше 20 000": 5
}

for (var topic in topics) {
    const button = { text: topic, url: `https://t.me/c/${souperGroupId}/${topics[topic]}` }
    inline_keyboard[inline_keyboard[0].length < 2 ? 0 : 1].push(button)
}

bot.telegram.sendMessage("-100" + channelId, "Выберите цену $", {reply_markup: { inline_keyboard }})

// bot.telegram.sendMessage(souperGroupId, "dfsf", { message_thread_id: 3 })

bot.launch()