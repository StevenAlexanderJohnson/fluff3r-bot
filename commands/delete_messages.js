const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_messages')
        .setDescription('Delete messages from channel')
        .addIntegerOption(option =>
            option.setName("count")
                .setDescription("number of messages to delete")
                .setRequired(true),
        ),
    async execute(interaction) { 
        if(interaction.options.get('count').value > 100) {
            await interaction.reply({ content: "Max number of messages that can be deleted at one time is 100.", components: [] });
            return;
        }
        interaction.channel.messages.fetch({limit: interaction.options.get('count').value})
            .then(messages => {
                for(const [key, value] of messages) {
                    value.delete();
                }
            })
            .catch(error => console.error(error));
        await interaction.reply({content: `${interaction.options.get('count').value} messages were deleted`});
    }
}