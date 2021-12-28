const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wbd')
        .setDescription('See who would be down for topic.')
        .addStringOption(option =>
            option.setName("game")
                .setDescription("what game you want to play")
                .setRequired(true),
        )
        .addIntegerOption(option =>
            option.setName("max_players")
                .setDescription("max number of players in your game")
                .setRequired(true),
        ),

    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('wbdYea')
                    .setLabel('Yea')
                    .setStyle('PRIMARY'),
            );
        await interaction.reply({ content: `Who would be down for ${interaction.options.get("game").value}`, components: [row] });
        const filter = () => { if (1 == 1) return true };
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 1000 * 10,
            fetchReply: true
        });

        var yeas = 0;
        var nos = 0;
        var counted = 0;
        collector.on('collect', async i => {
            yeas++;
            counted++;
            if(counted == interaction.options.get('max_players').value) {
                await i.update({ content: i.content + "\nUpdate: " + yeas + " people want to play.", components: [] });
                collector.stop();
            } else {
                await i.update({ content: i.content + "\nUpdate: " + yeas + " people want to play.", components: [row] });
            }
        });

        collector.on('end', async _ => {
            interaction.channel.send({ content: yeas + " people want to play", components: [] });
        });
    }
}