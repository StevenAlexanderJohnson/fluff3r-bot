const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const join = require('./join.js');
var queue = require('../models/songQueue.js');
// Test this
module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    
    resource: null,

    async execute(interaction) {
        if (queue.length != 0) {
            const player = createAudioPlayer();
            var connection = getVoiceConnection(interaction.guild.id);
            if(!connection) {
                join.execute(interaction);
                connection = getVoiceConnection(interaction.guild.id);
            }

            var songData = queue.shift();
            resource = songData[0];
            // Play the resource
            player.play(songData[0]);
            player.on('error', console.error);
            connection.subscribe(player);
            // Get the video info for the embed
            try {
                await interaction.reply({ embeds: [songData[1]] });
            }
            catch (err0r) {
                await interaction.followUp({ embeds: [songData[1]] });
            }
        } else {
            try {
                await interaction.reply({ content: "No song is queued" });
            }
            catch (error) {
                await interaction.followUp({ content: "No song is queued" });
            }
        }
    }
}