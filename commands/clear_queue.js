const { SlashCommandBuilder } = require('@discordjs/builders');
var queue = require('../models/songQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear_queue')
        .setDescription('Clears the music queue'),
    
    async execute(interaction) {
        while(queue.length != 0) {
            queue.pop();
        }
        interaction.reply("Queue has been emptied.");
    }
}