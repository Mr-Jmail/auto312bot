const { Scenes } = require("telegraf")
const { genPostText, addPost, getChannelIdForSending, addTopicsMessageToBd, getTopicsMessages } = require("./functions")
const moment = require('moment');
const sendTopicsMessage = require("./sendTopicsMessage");

module.exports = new Scenes.WizardScene("addCarScene",
    async ctx => {
        ctx.scene.session.state = { price: 0, brand: "", year: "", typeOfWheels: "", typeOfFuel: "", typeOfTransmission: "", rudderType: "", photoes: [], name: "", phoneNumber: "" }
        await ctx.replyWithPhoto("AgACAgIAAxkBAAICUmXUoNJ_wljfSf7Q74SOqUuNRWgXAAJD2zEbv46hSra7PhTesN-BAQADAgADeQADNAQ", { caption: "<b>Начинаем продажу машины</b>", parse_mode: "HTML" }).catch(err => console.log(err))
        await ctx.reply("Введите цену: 20 000 ❌, 20000 ✅").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        if (Number(ctx.message.text).toString() == "NaN" || ctx.message.text.includes(".")) return ctx.reply("Введите цену: 20 000 ❌, 20000 ✅").catch(err => console.log(err))
        ctx.scene.session.state.price = Number(ctx.message.text)
        ctx.reply("Введите марку машины").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        ctx.scene.session.state.brand = ctx.message.text
        ctx.reply("Введите год выпуска").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        ctx.scene.session.state.year = ctx.message.text
        ctx.reply("Выберите тип топлива", {reply_markup: {inline_keyboard: [[{ text: "бензин", callback_data: "бензин" }], [{ text: "дизель", callback_data: "дизель" }], [{ text: "электичество", callback_data: "электичество" }]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!["бензин", "дизель", "электичество"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        ctx.scene.session.state.typeOfFuel = ctx.callbackQuery.data
        ctx.reply("Какая коробка передач?", {reply_markup: {inline_keyboard: [[{ text: "механика", callback_data: "механика" }], [{ text: "автомат", callback_data: "автомат"}]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!["механика", "автомат"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        ctx.scene.session.state.typeOfTransmission = ctx.callbackQuery.data
        ctx.reply("Какой привод?", { reply_markup: { inline_keyboard: [[{ text: "задний", callback_data: "задний" }], [{ text: "передний", callback_data: "передний" }], [{ text: "полный", callback_data: "полный"}]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!["задний", "передний", "полный"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        ctx.scene.session.state.typeOfWheels = ctx.callbackQuery.data
        ctx.reply("Какой у вас руль:", { reply_markup: { inline_keyboard: [[{ text: "левый", callback_data: "левый" }], [{ text: "правый", callback_data: "правый" }]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!["левый", "правый"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        ctx.scene.session.state.rudderType = ctx.callbackQuery.data
        ctx.reply("Отправьте до 9 фото машины 📎⬇️").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "clearPhotoes")
        {
            ctx.scene.session.state.photoes = []
            return ctx.reply("Отправьте до 9 фото машины 📎⬇️").catch(err => console.log(err))
        }
        if (ctx?.callbackQuery?.data == "submitPhotoes")
        {
            if (ctx.scene.session.state.photoes.length == 0) return ctx.reply("Нужно добавить хотя бы одно фото").catch(err => console.log(err))
            ctx.reply("Введите ваше имя").catch(err => console.log(err))
            return ctx.wizard.next()
        }
        if (ctx.scene.session.state.photoes.length == 9) {
            ctx.reply("Уже добавлено 9 фотографий, я не могу принять больше", { reply_markup: { inline_keyboard: [[{ text: "Удалить все фотографии", callback_data: "clearPhotoes" }]] } }).catch(err => console.log(err))
            return resetTimer(ctx)
        }
        if (ctx?.message?.photo)
        {
            ctx.scene.session.state.photoes.push(ctx.message.photo[ctx.message.photo.length - 1].file_id)
            resetTimer(ctx);
            startTimer(ctx);
        }
    },
    ctx => {
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        ctx.scene.session.state.name = ctx.message.text
        ctx.reply("Введите номер телефона для связи в формате: 0555555555").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    async ctx => {
        if (!ctx?.message?.text) return await ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        const phoneNumber = ctx.message.text.replace(/ /ig, "").replace(/-/ig, "")
        if (!/^0[0-9]{9}$/.test(phoneNumber)) return await ctx.reply("Некорректный номер телефона, он должен начинаться с 0 и иметь полсе этого еще 9 цифр").catch(err => console.log(err))
        ctx.scene.session.state.phoneNumber = phoneNumber.replace("0", "+996")
        await sendAd(ctx, ctx.chat.id).catch(err => console.log(err))
        await ctx.reply("Ваше объявление будет выглядеть вот так", { reply_markup: { inline_keyboard: [[{ text: "опубликовать", callback_data: "publish" }], [{ text: "отменить и начать заново", callback_data: "restartScene" }]]}})
        return ctx.wizard.next()
    },
    async ctx => {
        if (!["restartScene", "publish"].includes(ctx?.callbackQuery?.data)) return await ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        if (ctx.callbackQuery.data == "restartScene") return ctx.scene.reenter()
        console.log(ctx.scene.session.state)
        const chatToSend = getChannelIdForSending(ctx.scene.session.state.price)
        const messages = await sendAd(ctx, chatToSend).catch(err => console.log(err))
        addPost(moment().add(2, "months"), messages.map(message => message.message_id), messages[0].chat.id)
        await ctx.reply("Объявление размещено на 2 месяца. По истечении срока, оно будет автоматически удалено", { reply_markup: { inline_keyboard: [[{ text: "➕ ещё одно", callback_data: "addCar" }], [{ text: "На главную", url: `https://t.me/koleso_312`}]]}}).catch(err => console.log(err))
        const messageIdToDelete = (getTopicsMessages())[chatToSend]
        if(messageIdToDelete) await ctx.telegram.deleteMessage(chatToSend, messageIdToDelete).catch(err => console.log(err))
        var topicsMessage = await sendTopicsMessage(chatToSend).catch(err => console.log(err))
        addTopicsMessageToBd(topicsMessage.chat.id, topicsMessage.message_id)
        ctx.scene.leave()
    }
) 

async function sendAd(ctx, chatId)
{
    const { price, brand, year, typeOfWheels, typeOfFuel, typeOfTransmission, rudderType, photoes, name, phoneNumber } = ctx.scene.session.state
    var mediagroup = []
    for (var i = 0; i < photoes.length; i++)
    {
        const media = { type: "photo", media: photoes[i] }
        if (i == 0)
        {
            media.caption = genPostText(price, brand, year, typeOfWheels, typeOfFuel, typeOfTransmission, rudderType, name, phoneNumber, `@${ctx.from.username}`)
            media.parse_mode = "HTML"
        }
        mediagroup.push(media)
    }
    const messages = await ctx.telegram.sendMediaGroup(chatId ?? getChannelIdForSending(price), mediagroup).catch(err => console.log(err))
    return messages
}

function startTimer(ctx) {
    ctx.scene.session.state.timer = setTimeout(async () => {
        const reply = await ctx.reply("Нажмите кнопку  ⬇️", { reply_markup: { inline_keyboard: [[{ text: "завершить прием фотографий", callback_data: "submitPhotoes" }]] } }).catch(err => console.log(err))
        ctx.scene.session.state.submitPhotoesMessageId = reply.message_id
    }, 2000);
}

function resetTimer(ctx) {
    clearTimeout(ctx.scene.session.state.timer);
    if (ctx.scene.session.state.submitPhotoesMessageId)
    {
        ctx.deleteMessage(ctx.scene.session.state.submitPhotoesMessageId).catch(err => console.log(err));
        delete ctx.scene.session.state.submitPhotoesMessageId;
    }

}

/*
{
  price: 20000,
  brand: 'fsafs',
  year: 'передний',
  typeOfFuel: 'бензин',
  typeOfTransmission: 'автомат',
  rudderType: 'левый',
  photoes: [
    'AgACAgIAAxkBAAOzZdDgAr8vWC4vIvW4b2Py6dGQy98AAoDUMRtw2olK9xMTkcfABFABAAMCAAN4AAM0BA',
    'AgACAgIAAxkBAAO0ZdDgAi5qVTFeI6P4Doc5ZzlSymYAAoHUMRtw2olKw53lXgLsMj4BAAMCAAN4AAM0BA',
    'AgACAgIAAxkBAAO1ZdDgAgoRjeGXk00yxfrSWHqTHdoAAoLUMRtw2olKU6Ukj_4ocwgBAAMCAANtAAM0BA',
    'AgACAgIAAxkBAAO2ZdDgAkUojcSb3AAB47sIhf_zRS9VAAKD1DEbcNqJSgABIUj6l9eUBwEAAwIAA3gAAzQE'
  ],
  name: 'я',
  phoneNumber: '+78432924381'
}
*/
