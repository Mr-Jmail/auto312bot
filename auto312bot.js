const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const cron = require("node-cron")
const { Telegraf, Scenes, session } = require("telegraf")
const bot = new Telegraf(process.env.botToken)

const addCarScene = require("./addCarScene")
const { getOldPosts, deleteOldPostsFromDb } = require("./functions")
const sendTopicsMessage = require("./sendTopicsMessage")
const { mainChannelId } = require("./ids.json")

const stage = new Scenes.Stage([addCarScene])

bot.use(session())
bot.use(stage.middleware())

bot.start(ctx => ctx.reply("Здравствуйте. Для добавления нового объявления вы можете использовать команду /addCar").catch(err => console.log(err)))

bot.command("sendButtons", async ctx => {
    await sendTopicsMessage(mainChannelId)
    await ctx.reply("Кнопки отправлены в главный чат")
})

bot.command("addCar", ctx => ctx.scene.enter("addCarScene"))

bot.action("addCar", ctx => ctx.scene.enter("addCarScene"))
    
bot.on("photo", ctx => ctx.reply(ctx.message.photo[ctx.message.photo.length - 1].file_id.toString()).catch(err => console.log(err)))

cron.schedule("0 0 * * *", async function ()
// ;(async function ()
{
    const postsToDelete = getOldPosts()
    for (var i = 0; i < postsToDelete.length; i++)
    {
        for (var j = 0; j < postsToDelete[i].message_ids.length; j++) await bot.telegram.deleteMessage(postsToDelete[i].chatId, postsToDelete[i].message_ids[j]).catch(err => console.log(err))
    }
    deleteOldPostsFromDb()
})
// ()


bot.launch()