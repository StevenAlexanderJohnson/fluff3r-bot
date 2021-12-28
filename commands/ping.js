const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong.'),
    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Primary')
                    .setStyle('PRIMARY'),
            );
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Some Title')
            .setURL('https://stevenajohnson.codes')
            .setDescription('Some description here');
        await interaction.reply({ content: 'Pong', ephemeral: true, embeds: [embed], components: [row] });
    }
};