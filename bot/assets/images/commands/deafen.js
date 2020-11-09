const Discord = require('discord.js')
module.exports= {
    name: 'deafen',
    category: 'moderation',
    description: 'deaf mute dem assholes',
    run: async(message, args, client) => {

        let modlog = message.guild.channels.cache.find(channel => channel.name === "g-modlog")
        let vmuteuser = message.mentions.members.first();
        let reason = args.slice(1).join(" ")


        if (!modlog) {
            const modlogEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setDescription('It looks like \`setup\` command has not been performed yet. Please contact an administrator')
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(modlogEmbed)
            return
        }

        if (!vmuteuser) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription('Specify who to deafen.')
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(errorEmbed)        
            return;
        }
    
        if (message.author === vmuteuser) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription('You cannot deafen yourself. Why would you do that?')
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(errorEmbed)
            return;
        }
    
        if (!reason) {
            reason = 'No reason given'
        }

        if (!message.member.hasPermission("MUTE_MEMBERS", explicit = true)) {
            const vmutepermEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription("You don't have the correct permissions.")
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(vmutepermEmbed)
            return
        } else if (!message.member.hasPermission("MUTE_MEMBERS", explicit = true)) {
            const vmutepermEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription("I don't have the correct permissions. Try re-inviting me and adding `Mute members` permission. If this problem occurs, do info command with support argument.")
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(vmutepermEmbed)
            return
        }

        if (message.member.roles.highest.position < vmuteuser.roles.highest.position || message.member.roles.highest.position === vmuteuser.roles.highest.position) {
            const superiorEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription('The person you are trying to deafen has a role superior or equal to you.')
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(superiorEmbed)
            return
        }

        if (vmuteuser.id === message.author.id) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription('You cannot deafen yourself. Why would you do that?')
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(errorEmbed)
            return
        }

        if (vmuteuser.id === message.guild.id) {
            message.channel.send("Nice try voice muting everyone... :)")
            return
        }

        if (!vmuteuser.voice.channel) {
            const novcembed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription('The member you specified is not connected to a voice channel.')
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(novcembed)
            return
        }

        if (vmuteuser.voice.serverMute) {
            const alreadyEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen unsuccessful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription('The member you specified is already deafened.')
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(alreadyEmbed)
            return
        } else {
            vmuteuser.voice.setDeaf(true, reason)
            const vmuteEmbed = new Discord.MessageEmbed()
                .setColor('#9f5000')
                .setTitle('Deafen successful')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`Successfully deafened **${vmuteuser.user.username}** for **${reason}**.`)
                .setThumbnail(message.client.user.avatarURL())
                .setTimestamp()
                .setFooter('Thank you for using GuineaBot!')
            message.channel.send(vmuteEmbed)
            vmuteuser.send(`You are deafened in **${message.guild.name}** for **${reason}**`).catch(() => message.channel.send("I wasn't able to send a DM to the deafened user. Don't worry! He was deafened anyway."))
        }
    
        const logEmbed = new Discord.MessageEmbed()
            .setColor('#9f5000')
            .setTitle('Deafen command executed')
            .setAuthor('Modlog')
            .addFields(
                { name: 'Moderator: ', value: `${message.author.tag} (${message.author.id})`},
                { name: 'Moderated on: ', value: `${vmuteuser.user.tag} (${vmuteuser.id})`},
                { name: 'Reason: ', value: `${reason}`},
                { name: 'Date: ', value: `${message.createdAt.toLocaleString()}`}
            )
            .setThumbnail(message.client.user.avatarURL())
            .setTimestamp()
            .setFooter('Thank you for using GuineaBot!')
        modlog.send(logEmbed)
        console.log(`${vmuteuser.user.tag} deafened in ${message.guild.name} (${message.guild.id}) for ${reason}.`)
    }
}