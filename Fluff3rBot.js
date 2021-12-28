const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

module.exports = client;

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log("Loading commands:")
for (const file of commandFiles) {
    console.log("\t" + file);
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
console.log("\n");

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
console.log("Loading events:")
for (const file of eventFiles) {
    console.log("\t" + file);
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
console.log("\n");


client.login(token);

module.exports = client;