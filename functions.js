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
    const keyMap = {
        price: 'Цена',
        brand: 'Марка',
        year: 'Год выпуска',
        typeOfWheels: 'Привод',
        typeOfFuel: 'Топливо',
        typeOfTransmission: 'Коробка',
        rudderType: 'Руль',
        phoneNumber: "📞",
        username: "Телеграм"
    };

    var outputText = '';
    for (var [key, value] of Object.entries({ price, brand, year, typeOfWheels, typeOfFuel, typeOfTransmission, rudderType, name, phoneNumber, username }))
    {
        var formattedKey = keyMap[key] || key;
        if (key == "phoneNumber") outputText += "\n"
        if (key == "username")
        {
            var _ = value
            value = formattedKey
            formattedKey = _
        }
        outputText += `${formattedKey}:`.padEnd(20) + `<b>${value}</b>\n`;
    }
    return outputText
}

module.exports = { getPosts, addPost, getOldPosts, deleteOldPostsFromDb, getChannelIdForSending, genPostText }