const Discord = require('discord.js')
const mongo = require('../../mongo')
const deafSchema = require('../../schemas/deafen')

module.exports = {
    name: "deafen",
    aliases: ["deaf"],
    requiredPermissions: ["DEAFEN_MEMBERS"],
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<mention> [reason]",
    description: "Prevent user from hearing in voice channels",
    category: "Moderation",
    run: async ({ message, args, text, client, prefix, instance }) => {
        let modlog = message.guild.channels.cache.find(channel => {
            return channel.name && channel.name.includes("g-modlog")
        })

        let target = message.mentions.members.first()
        let targetId = target.id
        let targetTag = `${target.user.username}#${target.user.discriminator}`

        if (targetId === client.user.id) return message.reply("You cannot mute me using me.")
        if (targetId === message.author.id) return message.reply("You cannot mute yourself.")
        if (target.user.bot) return message.reply("Target is a bot, failed to deafen.")

        let staff = message.member
        let staffId = staff.id
        let staffTag = `${staff.user.username}#${staff.user.discriminator}`

        let reason = args.slice(1).join(" ")

        if (!modlog) return message.channel.send(`Could not find channel **g-modlog**, please install the required values using \`${prefix}setup\`.`)
        if (!reason) reason = "No reason provided."
        if (staff.roles.highest.position < target.roles.highest.position) return message.reply(`You cannot mute ${targetTag} due to role hierarchy.`)

        if (!target.voice.channel) return message.reply(`${targetTag} is not connected to a voice channel.`)
        if (target.voice.serverDeaf) return message.reply(`${targetTag} is already server deafened.`)

        await mongo().then(async (mongoose) => {
            try {
                let data = await deafSchema.create({
                    deafId: targetId,
                    deafTag: targetTag,
                    staffId: staffId,
                    staffTag: staffTag,
                    reason: reason,
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    deafDate: Date.now()
                })

                const DMEmbed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`You have been deafened in ${data.guildName}`)
                    .setAuthor("Automated Guineabot message", message.client.user.avatarURL())
                    .setTimestamp()
                    .setFooter("Shoulda followed the rules... :/")
                    .addFields({
                        name: "Moderator",
                        value: staffTag
                    }, {
                        name: "Reason",
                        value: reason
                    }, {
                        name: "Date",
                        value: data.deafDate.toLocaleString()
                    })
                
                target
                    .createDM()
                    .then((DM) => {
                        DM.send(DMEmbed)
                            .then(() => {
                                target.voice.setDeaf(true, reason)

                                const success = new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setDescription(`Successfully deafened **${data.deafTag}** for **${data.reason}**`)
                                    .setFooter("Thank you for using GuineaBot!")
                                    .setTimestamp()
                                message.channel.send(success)

                                const modlogEmbed = new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setTitle("Member deafened")
                                    .setAuthor("Guineabot Modlog", message.client.user.avatarURL())
                                    .setTimestamp()
                                    .setFooter("Thank you for using GuineaBot!")
                                    .addFields({
                                        name: "Deafened member",
                                        value: `${targetTag} (${targetId})`
                                    }, {
                                        name: "Responsible moderator",
                                        value: `${staffTag} (${staffId})`
                                    }, {
                                        name: "Reason",
                                        value: `${reason}`
                                    }, {
                                        name: "Date",
                                        value: `${data.deafDate.toLocaleString()}`
                                    })
                                modlog.send(modlogEmbed)
                            })
                    })
            } catch (err) {
                console.log(err)
                message.channel.send(`An error occurred: \`${err.message}\``)
            }
        })
    }
}