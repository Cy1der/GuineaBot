const Discord = require('discord.js')
const mongo = require('../../mongo')
const muteSchema = require('../../schemas/chatmute')

module.exports = {
    name: "unchatmute",
    aliases: ["ucm"],
    requiredPermissions: ["MANAGE_ROLES"],
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<mention> [reason]",
    description: "Allow user to chat in channels",
    category: "Moderation",
    run: async (message, args, text, client, prefix, instance) => {
        let modlog = message.guild.channels.cache.find(channel => {
            return channel.name && channel.name.includes("g-modlog")
        })
        let role = message.guild.roles.cache.find(role => {
            return role.name === "gmuted"
        })

        let target = message.mentions.members.first()
        let targetId = target.id
        let targetTag = `${target.user.username}#${target.user.discriminator}`

        if (targetId === client.user.id) return message.reply("You cannot mute me using me.")
        if (targetId === message.author.id) return message.reply("You cannot mute yourself.")
        if (target.user.bot) return message.reply("Target is a bot, failed to unmute.")

        let staff = message.member
        let staffId = staff.id
        let staffTag = `${staff.user.username}#${staff.user.discriminator}`

        let reason = args.slice(1).join(" ")

        if (!modlog) return message.channel.send(`Could not find channel **g-modlog**, please install the required values using \`${prefix}setup\`.`)
        if (!role) return message.channel.send(`Could not find role **gmuted**, please install the required values using \`${prefix}setup\`.`)
        if (!target.roles.cache.has(role.id)) return message.channel.send(`Target ${targetTag} already does not have role **gmuted** assigned.`)
        if (!reason) reason = "No reason provided."
        if (staff.roles.highest.position < target.roles.highest.position) return message.reply(`You cannot unmute ${targetTag} due to role hierarchy.`)

        await mongo().then(async (mongoose) => {
            try {
                let data = await muteSchema.findOneAndDelete({
                    muteId: targetId,
                    guildId: message.guild.id,
                })

                const DMEmbed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`You have been un chat muted in ${data.guildName}`)
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
                        value: data.muteDate.toLocaleString()
                    })
                
                target
                    .createDM()
                    .then((DM) => {
                        DM.send(DMEmbed)
                            .then(() => {
                                target.roles.remove(role)

                                const success = new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setDescription(`Successfully un muted **${data.muteTag}** from chatting for **${reason}**`)
                                    .setFooter("Thank you for using GuineaBot!")
                                    .setTimestamp()
                                message.channel.send(success)

                                const modlogEmbed = new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setTitle("Member un chat muted")
                                    .setAuthor("Guineabot Modlog", message.client.user.avatarURL())
                                    .setTimestamp()
                                    .setFooter("Thank you for using GuineaBot!")
                                    .addFields({
                                        name: "Muted member",
                                        value: `${targetTag} (${targetId})`
                                    }, {
                                        name: "Responsible moderator",
                                        value: `${staffTag} (${staffId})`
                                    }, {
                                        name: "Reason",
                                        value: `${reason}`
                                    }, {
                                        name: "Date",
                                        value: `${data.muteDate.toLocaleString()}`
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