const {
    MessageEmbed,
    escapeMarkdown
} = require("discord.js")

module.exports = {
    name: 'queue',
    description: "Show song queue",
    run: async (message, args, client) => {
        const queue = message.client.queue.get(message.guild.id)
        if (!queue) return message.reply("No song is being played right now.")

        let description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`)
        let descriptionString = description.join("\n")

        console.log(descriptionString.length)
        if (descriptionString.length > 2048) {
            descriptionString = descriptionString.substring(0, 2045) + '...';
        }

        let queueEmbed = new MessageEmbed()
            .setColor('#9f5000')
            .setTitle('GuineaBot music queue')
            .setDescription(descriptionString)
            .setThumbnail(message.client.user.avatarURL())
            .setTimestamp()
            .setFooter('Thank you for using GuineaBot!')

        message.channel.send(queueEmbed)
    }
}