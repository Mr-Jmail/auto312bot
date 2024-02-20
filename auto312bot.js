const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const cron = require("node-cron")
const { Telegraf, Scenes, session } = require("telegraf")
const bot = new Telegraf(process.env.botToken)
const { souperGroupId } = require("./ids.json")

const addCarScene = require("./addCarScene")
const { getOldPosts, deleteOldPostsFromDb } = require("./functions")

const stage = new Scenes.Stage([addCarScene])

bot.use(session())
bot.use(stage.middleware())

bot.start(ctx => ctx.reply("Здравствуйте. Для добавления нового объявления вы можете использовать команду /addCar").catch(err => console.log(err)))

bot.command("addCar", ctx => ctx.scene.enter("addCarScene"))

// cron.schedule("0 0 * * *", async function ()
;(async function ()
{
    const postsToDelete = getOldPosts()
    for (var i = 0; i < postsToDelete.length; i++)
    {
        for (var j = 0; j < postsToDelete[i].message_ids.length; j++) await bot.telegram.deleteMessage(souperGroupId, postsToDelete[i].message_ids[j]).catch(err => console.log(err))
    }
    deleteOldPostsFromDb()
})
()
bot.launch()