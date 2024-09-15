const { SlashCommandBuilder } = require('@discordjs/builders');
const { ShopItem } = require('../models');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Displays the items available for purchase.'),

    async execute(interaction) {
        // Fetch available shop items from the database
        const items = await ShopItem.findAll();

        // Create a list of items with buy/sell prices
        const itemList = items.map(item => `${item.icon} **${item.name}**\nBuy: ${item.buyPrice} credits\nSell: ${item.sellPrice} credits`).join('\n\n');

        // Create an embed to display the shop items
        const shopEmbed = new MessageEmbed()
            .setTitle('🛒 Shop - Available Items')
            .setColor('#00FF00')
            .setDescription(itemList)
            .setFooter('Use /buy <item> to purchase an item.');

        return interaction.reply({ embeds: [shopEmbed] });
    }
};