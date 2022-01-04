const { SlashCommandBuilder } = require('@discordjs/builders');
const { OpusEncoder } = require('@discordjs/opus');
const wavConverter = require('wav-converter');
const { getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const { EndBehaviorType } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Records the channel.'),

    async execute(interaction) {
        const encoder = new OpusEncoder(64000, 2);
        var connection = getVoiceConnection(interaction.guild.id);
        // const player = createAudioPlayer();
        // var resource = createAudioResource("../record_start.wav", { inlineVolume: true });
        // resource.volume.setVolume(2);
        if (connection) {
            interaction.member.voice.channel.members.forEach((value, key) => {
                if (!value.user.bot) {
                    const audio = connection.receiver.subscribe(value.user.id, { end: { behavior: EndBehaviorType.AfterSilence, duration: 500 }, autoDestroy: true });
                    audio.pipe(fs.createWriteStream('user_audio'));
                    audio.on('close', function () {
                        try {
                            var process = new ffmpeg('user_audio.pcm');
                            process.then(function (something) {
                                something.fnExtractSoundToMP3('user_audio.mp3', function (error, file) {
                                    console.log("Audio file: " + file);
                                });
                            }, function (error) {
                                console.error(error);
                            });
                        }
                        catch (e) {
                            console.log(e);
                        }
                    });
                }
            });
            await interaction.reply({ ephemeral: true, content: 'Listening!' });
        }
        else {
            await interaction.reply({ content: "Join a voice channel first." });
        }
    }
}