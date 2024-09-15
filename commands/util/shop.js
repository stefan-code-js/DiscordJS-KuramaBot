const { SlashCommandBuilder } = require('@discordjs/builders');
const { ShopItem } = require('../models');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Displays the items available for purchase.'),

    async execute(interaction) {
        // Fetch all items from the shop
        const items = await ShopItem.findAll();

        // Format the shop items into a string
        const itemList = items.map(item => 
            `${item.icon} **${item.name}**\nBuy: ${item.buyPrice} credits\nSell: ${item.sellPrice} credits`
        ).join('\n\n');

        // Create an embed for the shop display
        const shopEmbed = new MessageEmbed()
            .setTitle('🛒 Shop - Available Items')
            .setColor('#00FF00')
            .setDescription(itemList)
            .setFooter('Use /buy <item> to purchase, /sell <item> to sell.');

        return interaction.reply({ embeds: [shopEmbed] });
    }
};