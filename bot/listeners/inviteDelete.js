const Discord = require("discord.js")
module.exports = (client) => {
    client.on("inviteDelete", invite => {
        let modlog = invite.guild.channels.cache.find(channel => channel.name.includes("g-modlog"))
        if (!modlog) return

        const logEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle('Invite Created')
            .setDescription(`**Temporary?** ${invite.temporary ? "Yes" : "No"}`)
            .addFields({
                name: "Code:",
                value: `(discord.gg/) ${invite.code}`
            }, {
                name: "Invite Channel:",
                value: `${invite.channel.name} (${invite.channel.id})`
            })
            .setTimestamp()
        modlog.send(logEmbed)
    })
}

module.exports.config = {
    displayName: "Invite Create",
    dbName: "GBOTmod",
    loadDBFirst: true
}