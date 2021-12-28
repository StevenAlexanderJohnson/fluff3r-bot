const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    execute() {
        var servers = JSON.parse(process.env.SERVERS);
        const commands = []
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        console.log("Loading commands:")
        for (const file of commandFiles) {
            console.log("\t" + file);
            const command = require(`./commands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        for(var server of servers) {
            rest.put(Routes.applicationGuildCommands(server.clientID, server.guildID), { body: commands })
                .then(() => console.log("Successfully registered application commands."))
                .catch(console.error);
        }
    }
}