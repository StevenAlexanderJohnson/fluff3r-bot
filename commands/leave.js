const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
var queue = require('../models/songQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Kicks bot from the voice channel.'),
    
    async execute(interaction) {
        try {
            const connection = getVoiceConnection(interaction.guild.id)
            if(connection) {
                connection.destroy();
            }
            else {
                interaction.reply("I'm not in a voice channel");
            }
        } catch (error) {
            console.error(error);
        }
    }
}