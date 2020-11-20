const Discord = require("discord.js")

//Whenever the bot joins a new Discord server
module.exports = (client) => {
    client.on('guildCreate', async joinedGuild => {
        //Creates a channel
        await joinedGuild.channels.create('read-me', { type: 'text' })

        //Looks for the channel
        let readme = joinedGuild.channels.cache.find(channel => channel.name === "read-me")
        
        const readmeEmbed = new Discord.MessageEmbed()
            .setColor('#9f5000')
            .setTitle('Read before using GuineaBot')
            .setDescription("**Before you use me please do the following or I will not work properly:\n**\n¬ @everyone should **NOT** have `send messages` enabled\n¬ Do not modify the permissions I generated for myself or I will **NOT** work properly\n¬ Perform `g?setup`\n¬ The higher my role is, the better the `chatmute` command will work")
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            .setFooter('Thank you for inviting GuineaBot!')

        //Sends the embedded message to that channel
        readme.send(readmeEmbed)

        //Updates status to match server count, however, there is a rate limit, so sometimes the bot will not update the status
        client.user.setActivity(`${client.guilds.cache.size} servers`, {
            type: 'WATCHING'
        }).catch(error => console.log(error));
    });
};