const Discord = require('discord.js')
const muteSchema = require('../../schemas/voicemute')
const mongo = require('../../mongo')

module.exports = {
    name: 'voicemute',
    aliases: ["vm"],
    requiredPermissions: ["MUTE_MEMBERS"],
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<mention> [reason]",
    description: 'Prevent user from talking in voice channels',
    category: "Moderation",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let modlog = message.guild.channels.cache.find(channel => {
            return channel.name && channel.name.includes("g-modlog")
        })

        let target = message.mentions.members.first()
        let targetId = target.id
        let targetTag = `${target.user.username}#${target.user.discriminator}`

        if (!target) return message.channel.send("You need to mention a valid user.")
        if (targetId === client.user.id) return message.reply("You cannot mute me using me.")
        if (targetId === message.author.id) return message.reply("You cannot mute yourself.")
        if (target.user.bot) return message.reply("Target is a bot, failed to mute.")

        let staff = message.member
        let staffId = staff.id
        let staffTag = `${staff.user.username}#${staff.user.discriminator}`

        let reason = args.slice(1).join(" ")

        if (!modlog) message.channel.send(`Could not find channel **g-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`)
        if (!reason) reason = "No reason provided."
        if (staff.roles.highest.position < target.roles.highest.position) return message.reply(`You cannot mute ${targetTag} due to role hierarchy.`)

        if (!target.voice.channel) return message.reply(`${targetTag} is not connected to a voice channel.`)
        if (target.voice.serverMute) return message.reply(`${targetTag} is already server muted.`)

        await mongo().then(async (mongoose) => {
            try {
                let data = await muteSchema.create({
                    muteId: targetId,
                    muteTag: targetTag,
                    staffId: staffId,
                    staffTag: staffTag,
                    reason: reason,
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    muteDate: Date.now(),
                })

                target.voice.setMute(true, reason)

                const success = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`Successfully voice muted **${data.muteTag}** for **${data.reason}**`)
                    .setFooter("Thank you for using GuineaBot!")
                    .setTimestamp()
                message.channel.send(success)
            } catch (err) {
                console.log(err)
                message.channel.send(`An error occurred: \`${err.message}\``)
            }
        })
    }
}