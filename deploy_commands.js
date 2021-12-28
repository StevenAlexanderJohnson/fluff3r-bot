const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { servers, token } = require('./config.json');

module.exports = {
    execute() {
        const commands = []
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        console.log("Loading commands:")
        for (const file of commandFiles) {
            console.log("\t" + file);
            const command = require(`./commands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '9' }).setToken(token);

        for(var server of servers) {
            rest.put(Routes.applicationGuildCommands(server.clientID, server.guildID), { body: commands })
                .then(() => console.log("Successfully registered application commands."))
                .catch(console.error);
        }
    }
}