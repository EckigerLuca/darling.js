/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentaineko')
        .setDescription('Returns a random hentai neko pic')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many images the bot should send')
                .setRequired(true)
                .addChoice('One', '1')
                .addChoice('Five', '5')
                .addChoice('Ten', '10')),

        async execute(interaction) {
            if (interaction.channel.nsfw) {
                const amount = interaction.options.getString('amount');

                async function fetchImage() {
                    const response = await fetch('https://api.waifu.pics/nsfw/neko');
                    const data = await response.json();
                    const img_url = data.url;
                    return img_url;
                }

                const real_amount = amount - 1;
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle('Random hentai neko pic?')
                    .setFooter({ text: 'From waifu.pics' })
                    .setImage(await fetchImage());


                await interaction.reply({ embeds: [embed] });
                for (let i = 0; i < real_amount; i++){
                    embed.setImage(await fetchImage());
                    await interaction.followUp({ embeds: [embed] });
            }
        }
        else {
            await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true });
            return;
        }
    },
};