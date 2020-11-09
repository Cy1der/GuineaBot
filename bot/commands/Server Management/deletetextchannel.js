const Discord = require("discord.js")
module.exports = {
    name: 'deletetextchannel',
    category: 'server management',
    description: 'Delete a text channel',
    run: async (message, args, client) => {
        if (!message.member.hasPermission("MANAGE_CHANNELS", explicit = true)) {
            const permEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Delete text channel unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription("You don't have the correct permissions.")
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(permEmbed)
            return
        } else if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
            const permEmbed2 = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Delete text channel unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription("I don't have the correct permissions. Try re-inviting me and adding `Manage Channels` permission. If this problem occurs, do g?info support.")
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(permEmbed2)
            return
        }

        let modlog = message.guild.channels.cache.find(channel => channel.name === "g-modlog")

        if (!modlog) {
            const modlogEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Delete text channel unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`It looks like \`setup\` command has not been performed yet. Please contact an administrator`)
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(modlogEmbed)
            return
        }

        if (!args[0]) {
            const nochnlEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Delete text channel unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`Please mention a channel or provide it's ID.`)
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(nochnlEmbed)
            return
        }

        let channel = message.mentions.channels.first() || message.client.channels.cache.get(args[0])
        let reason = args[1]

        if (!args[1]) {
            reason = "No reason given"
        }

        if (!channel) {
            const nochnlEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Delete text channel unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`Please mention a channel or provide it's ID.`)
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(nochnlEmbed)
            return
        }

        if (channel.type === "voice") {
            const WRONGCOMMANDBITCH = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Delete text channel unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`This command is meant to delete **text** channels, if you wish to delete a voice channel, please use g?deletevoicechannel or dvc for short.`)
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(WRONGCOMMANDBITCH)
            return
        }

        channel.delete()

        const success = new Discord.MessageEmbed()
            .setColor('#9f5000')
            .setTitle('Delete text channel successful')
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setDescription(`Successfully deleted ${channel.name}`)
            .setThumbnail(message.client.user.avatarURL())
            .setTimestamp()
            .setFooter('Thank you for using GuineaBot!')
        message.channel.send(success)

        const logEmbed = new Discord.MessageEmbed()
            .setColor('#9f5000')
            .setTitle('Channel deleted')
            .setAuthor('Modlog')
            .addFields({
                name: 'Moderator: ',
                value: `${message.author.tag} (${message.author.id})`
            }, {
                name: "Channel name: ",
                value: `${channel.name}`
            }, {
                name: 'Reason: ',
                value: `${reason}`
            }, {
                name: 'Date: ',
                value: `${message.createdAt.toLocaleString()}`
            })
            .setThumbnail(message.client.user.avatarURL())
            .setTimestamp()
            .setFooter('Thank you for using GuineaBot!')
        modlog.send(logEmbed)
    }
}