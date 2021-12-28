const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins the same voice channel as you.'),
    
    async execute(interaction) {
        var channel = interaction.member.voice;
        const player = createAudioPlayer();
        if(channel) {
            try {
                const connection = joinVoiceChannel({
                    channelId: channel.channelId,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                connection.subscribe(player);
                await interaction.reply("joined");
            } catch (error) {
                console.error(error);
            }
        }
        else {
            await interaction.reply({content: "Join a voice channel first."});
        }
    }
}