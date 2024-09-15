const { SlashCommandBuilder } = require('@discordjs/builders');
const { ShopItem } = require('../models');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Shop commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View items in the shop'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('The item to buy')
            .setRequired(true)
            .addChoices(
              { name: 'Pickaxe', value: 'pickaxe' },
              { name: 'Fishing Rod', value: 'fishingrod' } // Added fishing rod as an option
            ))
        .addIntegerOption(option =>
          option.setName('quantity')
            .setDescription('Quantity to buy')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('sell')
        .setDescription('Sell an item from your inventory')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('The item to sell')
            .setRequired(true)
            .addChoices(
              { name: 'Pickaxe', value: 'pickaxe' },
              { name: 'Fishing Rod', value: 'fishingrod' } // Added fishing rod as an option
            ))
        .addIntegerOption(option =>
          option.setName('quantity')
            .setDescription('Quantity to sell')
            .setRequired(true))),

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