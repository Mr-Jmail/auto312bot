const path = require("path")
const fs = require("fs")
const postsFilePath = path.join(__dirname, "posts.json")
const moment = require("moment")

function getPosts() 
{
    const posts = JSON.parse(fs.readFileSync(postsFilePath, "utf-8"))
    return posts
}

function addPost(dateToDelete, message_ids = [])
{
    const posts = getPosts()
    posts.push({ dateToDelete, message_ids })
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

function getThreadIdForSending(price) 
{
    switch (true)
    {
        case (price < 5000): return 0;
        case (price <= 10000): return 3;
        case (price <= 20000): return 4;
        default: return 5;
    }
}

function genPostText(price, brand, year, typeOfFuel, typeOfTransmission, rudderType, name, phoneNumber, username)
{
    return `<b>Информация о машине</b>\n\nЦена: ${price}\nМарка: ${brand}\nГод выпуска: ${year}\nТопливо: ${typeOfFuel}\nКоробка передач: ${typeOfTransmission}\nРуль: ${rudderType}\n\n<b>Информация о продавце</b>\n\nИмя: ${name}\nНомер телефона: ${phoneNumber}\n${username ? `Телеграм: @${username}` : "" }`
}

module.exports = { getPosts, addPost, getOldPosts, deleteOldPostsFromDb, getThreadIdForSending, genPostText }