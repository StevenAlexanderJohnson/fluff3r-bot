const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
var queue = require('../models/songQueue.js');
const yts = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription("Queue music from youtube.")
        .addStringOption(option =>
            option.setName('video')
                .setDescription("url or name of the video")
                .setRequired(true)),

    // Resource used to play music
    resource: null,

    async execute(interaction) {
        // If the video input is a url
        if (interaction.options.get('video').value.includes(".com")) {
            // Get video info for the embed
            let videoInfo = await ytdl.getBasicInfo(interaction.options.get('video').value);
            const embed = new MessageEmbed()
                .setTitle("Added " + videoInfo.videoDetails.title)
                .setDescription(videoInfo.videoDetails.video_url)
                .setThumbnail(videoInfo.videoDetails.thumbnails[0].url)
            // Get the stream data
            var stream = ytdl(interaction.options.get("video").value, { filter: 'audioonly', opusEncoded: true, quality: 'lowestaudio' });
            // Create a resource to be played and set volume
            resource = createAudioResource(stream, {inlineVolume: true});
            resource.volume.setVolume(.2);
            queue.push([resource, embed]);
            // Reply to the interaction
            try {
                await interaction.reply({ embeds: [embed] });
            } catch(error) {
                await interaction.followUp({embeds: [embed]});
            }
        }
        // Else it is a song name
        else {
            // Get a list of videos that have names close to input
            var videoList = await yts(interaction.options.get('video').value);
            // Create the embed
            const embed = new MessageEmbed()
                .setTitle("Added " + videoList.all[0].title)
                .setDescription(videoList.all[0].url)
                .setThumbnail(videoList.all[0].thumbnail)
            // Get the stream data, create resource and push to queue
            var stream = ytdl(videoList.all[0].url, { filter: 'audioonly', opusEncoded: true, quality: "lowestaudio" });
            resource = createAudioResource(stream, { inlineVolume: true });
            resource.volume.setVolume(.2);
            queue.push([resource, embed]);
            // Respond
            try {
                await interaction.reply({ embeds: [embed] });
            } catch(error) {
                await interaction.followUp({embeds: [embed]});
            }
        }
    }
}