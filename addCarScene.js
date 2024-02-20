const { Scenes } = require("telegraf")
const { genPostText, getThreadIdForSending, addPost } = require("./functions")
const moment = require('moment');
const { souperGroupId } = require("./ids.json")

const restartButton = { text: "заполнить заново", callback_data: "toStartScene" }

module.exports = new Scenes.WizardScene("addCarScene",
    async ctx => {
        ctx.scene.session.state = { price: 0, brand: "", year: "", typeOfWheels: "", typeOfFuel: "", typeOfTransmission: "", rudderType: "", photoes: [], name: "", phoneNumber: "" }
        await ctx.replyWithPhoto("", { caption: "<b>Начинаем продажу машины</b>", parse_mode: "HTML" })
        await ctx.reply("Введите цену: 20 000 ❌, 20000 ✅").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        if (Number(ctx.message.text).toString() == "NaN" || ctx.message.text.includes(".")) return ctx.reply("Введите цену: 20 000 ❌, 20000 ✅").catch(err => console.log(err))
        ctx.scene.session.state.price = Number(ctx.message.text)
        ctx.reply("Введите марку машины", {reply_markup: {inline_keyboard: [[restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом")
        ctx.scene.session.state.brand = ctx.message.text
        ctx.reply("Введите год выпуска", {reply_markup: {inline_keyboard: [[restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        ctx.scene.session.state.year = ctx.message.text
        ctx.reply("Выберите тип топлива", {reply_markup: {inline_keyboard: [[{ text: "бензин", callback_data: "бензин" }], [{ text: "дизель", callback_data: "дизель" }], [{ text: "электичество", callback_data: "электичество" }], [restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (!["бензин", "дизель", "электичество"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.typeOfFuel = ctx.callbackQuery.data
        ctx.reply("Какая коробка передач?", {reply_markup: {inline_keyboard: [[{ text: "механика", callback_data: "механика" }], [{ text: "автомат", callback_data: "автомат"}], [restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (!["механика", "автомат"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        ctx.scene.session.state.typeOfTransmission = ctx.callbackQuery.data
        ctx.reply("Какие ведущие колеса?", {reply_markup: {inline_keyboard: [[{ text: "задние", callback_data: "задние" }], [{ text: "передние", callback_data: "передние" }], [restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (!["задние", "передние"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок")
        ctx.scene.session.state.typeOfWheels = ctx.callbackQuery.data
        ctx.reply("Какой у вас руль:", { reply_markup: { inline_keyboard: [[{ text: "левый", callback_data: "левый" }], [{ text: "правый", callback_data: "правый" }], [restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (!["левый", "правый"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        ctx.scene.session.state.rudderType = ctx.callbackQuery.data
        ctx.reply("Отправьте до 9 фотографий машины, когда отправите все нужные фотографии, нажмите кнопку ниже", { reply_markup: { inline_keyboard: [[{ text: "завершить прием фотографий", callback_data: "submitPhotoes" }], [restartButton]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    ctx => {
        if (ctx?.callbackQuery?.data == "toStartScene") return ctx.scene.reenter()
        if (ctx?.callbackQuery?.data == "clearPhotoes")
        {
            ctx.scene.session.state.photoes = []
            return ctx.reply("Отправьте до 9 фотографий машины, когда отправите все нужные фотографии, нажмите кнопку ниже", { reply_markup: { inline_keyboard: [[{ text: "завершить прием фотографий", callback_data: "submitPhotoes" }], [restartButton]]}}).catch(err => console.log(err))
        }
        if (ctx?.callbackQuery?.data == "submitPhotoes")
        {
            if (ctx.scene.session.state.photoes.length == 0) return ctx.reply("Нужно добавить хотя бы одно фото").catch(err => console.log(err))
            ctx.reply("Отправьте имя человека, который продает автомобиль").catch(err => console.log(err))
            return ctx.wizard.next()
        }
        if (ctx.scene.session.state.photoes.length == 9) return ctx.reply("Уже добавлено 9 фотографий, я не могу принять больше", {reply_markup: {inline_keyboard: [[{text: "Удалить все фотографии", callback_data: "clearPhotoes"}]]}}).catch(err => console.log(err))
        if (ctx?.message?.photo) ctx.scene.session.state.photoes.push(ctx.message.photo[ctx.message.photo.length - 1].file_id)
    },
    ctx => {
        if (!ctx?.message?.text) return ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        ctx.scene.session.state.name = ctx.message.text
        ctx.reply("Введите номер телефона для связи").catch(err => console.log(err))
        return ctx.wizard.next()
    },
    async ctx => {
        if (!ctx?.message?.text) return await ctx.reply("Дайте ответ текстом").catch(err => console.log(err))
        if (!/^((\+7|7|8)+([0-9]){10})$/.test(ctx.message.text)) return await ctx.reply("Некорректный номер телефона, он должен начинаться с 7, +7 или 8 и иметь полсе этого еще 10 цифр").catch(err => console.log(err))
        ctx.scene.session.state.phoneNumber = ctx.message.text
        const { price, brand, year, typeOfFuel, typeOfTransmission, rudderType, photoes, name, phoneNumber } = ctx.scene.session.state
        await sendAd(price, brand, year, typeOfFuel, typeOfTransmission, rudderType, photoes, name, phoneNumber, ctx.from.username)
        await ctx.reply("Ваше объявление будет выглядеть вот так", { reply_markup: { inline_keyboard: [[{ text: "опубликовать", callback_data: "publish" }], [{ text: "отменить и начать заново", callback_data: "restartScene" }]]}})
        return ctx.wizard.next()
    },
    async ctx => {
        if (!["publish", "restartScene"].includes(ctx?.callbackQuery?.data)) return await ctx.reply("Выберите одну из кнопок")
        if (ctx.callbackQuery.data == "restartScene") return ctx.scene.reenter()
        const { price, brand, year, typeOfFuel, typeOfTransmission, rudderType, photoes, name, phoneNumber } = ctx.scene.session.state
        const messages = await sendAd(price, brand, year, typeOfFuel, typeOfTransmission, rudderType, photoes, name, phoneNumber, ctx.from.username)
        addPost(moment().add(2, "months"), messages.map(message => message.message_id))
        await ctx.reply("Объявление успешно добавлено").catch(err => console.log(err))
        console.log(ctx.scene.session.state)
        ctx.scene.leave()
    }
) 

async function sendAd(price, brand, year, typeOfFuel, typeOfTransmission, rudderType, photoes, name, phoneNumber, username)
{
    var mediagroup = []
    for (var i = 0; i < photoes.length; i++) {
        const media = { type: "photo", media: photoes[i] }
        if (i == 0) {
            media.caption = genPostText(price, brand, year, typeOfFuel, typeOfTransmission, rudderType, name, phoneNumber, username)
            media.parse_mode = "HTML"
        }
        mediagroup.push(media)
    }
    const messages = await ctx.telegram.sendMediaGroup(souperGroupId, mediagroup, { message_thread_id: getThreadIdForSending(price) }).catch(err => console.log(err))
    return messages
}
/*
{
  price: 20000,
  brand: 'fsafs',
  year: 'передние',
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
