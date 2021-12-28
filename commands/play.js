const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const join = require('./join.js');
var queue = require('../models/songQueue.js');
const queuejs = require('./queue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("Play music from youtube.")
        .addStringOption(option =>
            option.setName('video')
                .setDescription("url or name of the video")
                .setRequired(false)),

    async execute(interaction) {
        const player = createAudioPlayer();
        var resource = null;
        var connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            join.execute(interaction);
            connection = getVoiceConnection(interaction.guild.id);
        }

        if(queue.length != 0)
        {
            var songData = queue.shift();
            player.play(songData[0]);
            player.on('error', console.error);
            connection.subscribe(player);
        }
        else if(interaction.options.get('video') != null){
            queuejs.execute(interaction);
        }

        player.on(AudioPlayerStatus.Idle, async () => {
            if (queue.length != 0) {
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
            }
            else {
                await interaction.followUp({ content: "No song is queued" });
            }
        });
    },
}
