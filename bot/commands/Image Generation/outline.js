const Jimp = require("jimp")
const Discord = require("discord.js")
module.exports = {
    name: 'outline',
    aliases: ["edgedetect"],
    minArgs: 0,
    maxArgs: 0,
    description: "Detect edges in an image",
    category: "Images",
    run: async ({ message, args, text, client, prefix, instance }) => {
        let attachments = message.attachments.array()
        if (attachments.length === 0) return message.reply("Please upload an image, the caption should be this command.")
        if (attachments.length > 1) return message.reply("One image please!")

        Jimp.read(`${attachments[0].url}`, (err, lenna) => {
            if (err) throw err

            lenna.convolute([
                [-1, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1]
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