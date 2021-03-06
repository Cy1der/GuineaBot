//This is for whenever the bot is kicked/banned from a server
module.exports = (client) => {
    client.on("guildDelete", deletedGuild => {
        //Updates status to match server count, however, there is a rate limit, so sometimes the bot will not update the status
        let serverText = "servers"
        if (client.guilds.cache.size === 1) serverText = "server"

        client.user.setPresence({
            activity: {
                name: `g?help | ${client.guilds.cache.size} ${serverText}`,
                type: "STREAMING",
                url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, //get noobed
            },
            status: "online"
        })
    });
}

module.exports.config = {
    displayName: "Server Leave",
    dbName: "GBOTguilddelete",
    loadDBFirst: true
}