const mongo = require('../../mongo')
const profileSchema = require("../../schemas/profile")
const ms = require("ms")

module.exports = {
    name: "weekly",
    minArgs: 0,
    maxArgs: 0,
    description: "Claim weekly coins",
    category: "Economy",
    run: async ({ message, args, text, client, prefix, instance }) => {
        let target = message.author
        let userId = target.id

        await mongo().then(async (mongoose) => {
            try {
                let data = await profileSchema.findOne({
                    userId: userId
                })

                if (!data) {
                    let newData = await profileSchema.create({
                        userId: userId,
                        job: "Unemployed",
                        bank: 0,
                        wallet: 0,
                        multiplier: 1,
                        inventory: [Object],
                        dailyCooldown: Date.now(),
                        workCooldown: Date.now(),
                        weeklyCooldown: Date.now(),
                        monthlyCooldown: Date.now(),
                        hourlyCooldown: Date.now(),
                        begCooldown: Date.now(),
                        robCooldown: Date.now(),
                        bankRobCooldown: Date.now()
                    })

                    data = newData
                }

                if (data.weeklyCooldown > Date.now()) {
                    let timeLeft = Date.parse(data.weeklyCooldown) - Date.now()

                    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
                    let hours = Math.floor(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (100 * 60 * 60)) / 10)
                    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
                    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

                    return message.reply(`You must wait **${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds** before claiming your weekly coins again!`)
                } else {
                    await profileSchema.findOneAndUpdate({
                        userId: userId
                    }, {
                        userId: userId,
                        weeklyCooldown: Date.now() + ms("7d")
                    })

                    let currentWallet = data.wallet
                    
                    let coinsEarned = Math.floor(5000 * data.multiplier)
                    let roundedCoins = Math.floor(coinsEarned * 100) / 100

                    await profileSchema.findOneAndUpdate({userId: userId}, {
                        userId: userId,
                        wallet: currentWallet + roundedCoins,
                    }, {
                        upsert: true,
                    })

                    return message.reply(`$${formatNumber(roundedCoins)} have been added to your wallet!`)
                }
            } catch (err) {
                console.error(err)
                message.channel.send(`An error occurred: ${err.message}\nUsually this happens once, please try again.`)
            }
        })
    }
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}