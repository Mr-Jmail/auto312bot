const { under5000, under10000, under20000, more20000, mainChannelId } = require("./ids.json")

module.exports = function (bot)
{
    const inline_keyboard = [[], []]

    var channels = {
        "до 5000": under5000,
        "5 000 - 10 000": under10000,
        "10 000 - 20 000": under20000,
        "Свыше 20 000": more20000
    }

    for (var channel in channels)
    {
        console.log(channel.substring(3))
        const button = { text: channel, url: `https://t.me/c/${channels[channel].toString().substring(3)}` }
        inline_keyboard[inline_keyboard[0].length < 2 ? 0 : 1].push(button)
    }

    bot.telegram.sendMessage(mainChannelId, "Выберите цену $", { reply_markup: { inline_keyboard } }).catch(err => console.log(err))
}