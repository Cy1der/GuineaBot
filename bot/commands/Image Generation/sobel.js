const Jimp = require("jimp")
const Discord = require("discord.js")
module.exports = {
    name: 'sobel',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<direction (left, right, top, bottom)>',
    description: "Get the image's direction's look",
    category: "Images",
    run: async (message, args, text, client, prefix, instance) => {
        let attachments = message.attachments.array()
        if (attachments.length === 0) return message.reply("Please upload an image, the caption should be this command.")
        if (attachments.length > 1) return message.reply("One image please!")

        if (!args[0]) return message.reply("Which direction? Left, right, top or bottom?")
        if (args[1]) return message.reply("One direction please.")

        if (args[0] === "top") {
            Jimp.read(`${attachments[0].url}`, (err, lenna) => {
                if (err) throw err

                lenna.convolute([
                    [1, 0, -1],
                    [2, 0, -2],
                    [1, 0, -1]
                ])

                lenna.getBuffer(Jimp.MIME_PNG, (err, result) => {
                    if (err) { 
                        message.channel.send("An error occurred: " + err.message)
                        console.log(err)
                        return
                    }

                    const attachment = new Discord.MessageAttachment(result, "modifiedImage.png")
                    message.channel.send(attachment)
                })
            })
        } else if (args[0] === "bottom") {
            Jimp.read(`${attachments[0].url}`, (err, lenna) => {
                if (err) throw err

                lenna.convolute([
                    [-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]
                ])

                lenna.getBuffer(Jimp.MIME_PNG, (err, result) => {
                    if (err) { 
                        message.channel.send("An error occurred: " + err.message)
                        console.log(err)
                        return
                    }
                    
                    const attachment = new Discord.MessageAttachment(result, "modifiedImage.png")
                    message.channel.send(attachment)
                })
            })
        } else if (args[0] === "right") {
            Jimp.read(`${attachments[0].url}`, (err, lenna) => {
                if (err) throw err

                lenna.convolute([
                    [-1, -2, -1],
                    [0, 0, 0],
                    [1, 2, 1]
                ])

                lenna.getBuffer(Jimp.MIME_PNG, (err, result) => {
                    if (err) { 
                        message.channel.send("An error occurred: " + err.message)
                        console.log(err)
                        return
                    }
                    
                    const attachment = new Discord.MessageAttachment(result, "modifiedImage.png")
                    message.channel.send(attachment)
                })
            })
        } else if (args[0] === "left") {
            Jimp.read(`${attachments[0].url}`, (err, lenna) => {
                if (err) throw err

                lenna.convolute([
                    [1, 2, 1],
                    [0, 0, 0],
                    [-1, -2, -1]
                ])

                lenna.getBuffer(Jimp.MIME_PNG, (err, result) => {
                    if (err) { 
                        message.channel.send("An error occurred: " + err.message)
                        console.log(err)
                        return
                    }
                    
                    const attachment = new Discord.MessageAttachment(result, "modifiedImage.png")
                    message.channel.send(attachment)
                })
            })
        }
    }
}