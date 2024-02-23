const path = require("path")
const fs = require("fs")
const postsFilePath = path.join(__dirname, "posts.json")
const topicsMessagesFilePath = path.join(__dirname, "lastTopicsMessage.json")
const moment = require("moment")

function getPosts() 
{
    const posts = JSON.parse(fs.readFileSync(postsFilePath, "utf-8"))
    return posts
}

function addPost(dateToDelete, message_ids = [], chatId)
{
    const posts = getPosts()
    posts.push({ dateToDelete, message_ids, chatId })
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 4), "utf-8")
}

function getOldPosts() 
{
    const posts = getPosts()
    return posts.filter(post => moment(post.dateToDelete).isSameOrBefore(moment()))
}

function deleteOldPostsFromDb()
{
    const posts = getPosts()
    const actualPosts = posts.filter(post => moment(post.dateToDelete).isAfter(moment().format()))
    fs.writeFileSync(postsFilePath, JSON.stringify(actualPosts, null, 4), "utf-8")
}

function getChannelIdForSending(price) 
{
    switch (true)
    {
        case (price < 5000): return -1002056248534;
        case (price <= 10000): return -1002009477767;
        case (price <= 20000): return -1002073674875;
        default: return -1002034229783;
    }
}

function genPostText(price, brand, year, typeOfWheels, typeOfFuel, typeOfTransmission, rudderType, name, phoneNumber, username)
{
    return `Цена: <b>${price}</b>\nМарка: <b>${brand}</b>\nГод выпуска: <b>${year}</b>\nПривод: <b>${typeOfWheels}</b>\nТопливо: <b>${typeOfFuel}</b>\nКоробка: <b>${typeOfTransmission}</b>\nРуль: <b>${rudderType}</b>\n\nПродавец: ${name}\nТелефон: <b>${phoneNumber}</b>\n${username ? `<b>${username}</b> - телеграм` : ""}`
}

function getTopicsMessages()
{
    return JSON.parse(fs.readFileSync(topicsMessagesFilePath, "utf-8"))
}

function addTopicsMessageToBd(chatId, messageId) 
{
    const topicsMessages = getTopicsMessages()
    topicsMessages[chatId] = messageId
    fs.writeFileSync(topicsMessagesFilePath, JSON.stringify(topicsMessages, null, 4), "utf-8")
}

module.exports = { getPosts, addPost, getOldPosts, deleteOldPostsFromDb, getChannelIdForSending, genPostText, getTopicsMessages, addTopicsMessageToBd }