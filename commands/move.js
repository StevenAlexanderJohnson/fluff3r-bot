const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

/*****************************************
 * NEED TO MAKE IT ALSO MOVE ATTACHMENTS *
 *****************************************/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move messages from one channel to another')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription("number of messages to move")
                .setRequired(true))
        .addStringOption(option => 
            option.setName('move-to')
                .setDescription("channel to move to")
                .setRequired(true)),
    async execute(interaction) {
        var channel = await interaction.guild.channels.cache.find(channel => channel.name === interaction.options.get('move-to').value);
        interaction.channel.messages.fetch({ limit: interaction.options.get('count').value })
        .then((messages) => {
            let embed = null;
            let avatar = interaction.user.displayAvatarURL();
            for(const [key, value] of messages) {
                embed = new MessageEmbed()
                    .setAuthor(value.author.username)
                    .setDescription(value.content)
                    .setThumbnail(avatar);
                channel.send({embeds: [
                    embed
                ]});
                value.delete();
            }
        }).catch((err) => {
            console.error(err);
        });
        await interaction.reply({content: `Moved ${interaction.options.get('count').value} to ${interaction.options.get('move-to').value}`});
    }
};