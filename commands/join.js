const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel,  createAudioPlayer } = require('@discordjs/voice');

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
                    selfDeaf: false
                });
                connection.subscribe(player);
            } catch (error) {
                console.error(error);
                await interaction.reply({content: "Error joining channel"});
                return;
            }
            try {
                await interaction.reply({ content: "Joined"});
                return;
            } catch (error) {
                await interaction.editReply({content: "Joined"});
                return;
            }
        }
        else {
            await interaction.reply({content: "Join a voice channel first."});
        }
    }
}