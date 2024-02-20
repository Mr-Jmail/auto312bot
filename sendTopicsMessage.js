module.exports = function (bot)
{
    const { souperGroupId, channelId } = require("./ids.json")

    const inline_keyboard = [[], []]

    const topics = {
        "до 5000": 1,
        "5000 - 10000": 3,
        "10 000-20 000": 4,
        "Свыше 20 000": 5
    }

    for (var topic in topics)
    {
        const button = { text: topic, url: `https://t.me/c/${souperGroupId}/${topics[topic]}` }
        inline_keyboard[inline_keyboard[0].length < 2 ? 0 : 1].push(button)
    }

    bot.telegram.sendMessage(channelId, "Выберите цену $", { reply_markup: { inline_keyboard } }).catch(err => console.log(err))
}