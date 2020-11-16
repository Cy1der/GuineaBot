const Chess = require("./assets/chess")
module.exports = {
    name: "chess",
    category: "games",
    description: "chess game",
    run: async (message, args, client) => {
        const game = new Chess(client)
        game.newGame(message)
    }
}