const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Inventory, User } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usePotion')
        .setDescription('Use an item or potion from your inventory.')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The item you want to use.')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const itemName = interaction.options.getString('item').toLowerCase();

        // Fetch the item from the user's inventory
        const userInventory = await Inventory.findOne({ where: { userId, itemName } });

        if (!userInventory || userInventory.quantity < 1) {
            return interaction.reply(`❌ You don't have any **${itemName}** in your inventory.`);
        }

        let effectDescription = '';
        if (itemName === 'xp boost potion') {
            effectDescription = '⭐ Your XP gain is boosted by 50% for the next 3 hunts!';
            userInventory.isXPBoostActive = true;
            userInventory.effectDuration = 3;  // 3 hunts
        } else if (itemName === 'coin multiplier') {
            effectDescription = '💰 Your coin rewards will be doubled for the next 3 hunts!';
            userInventory.isCoinMultiplierActive = true;
            userInventory.effectDuration = 3;
        } else if (itemName === 'health potion') {
            effectDescription = '❤️ You are protected from losing items during the next bad encounter!';
            userInventory.isHealthPotionActive = true;
            userInventory.effectDuration = 1;  // One-time protection
        } else if (itemName.includes('scroll')) {
            effectDescription = `🌀 You have activated the **${itemName}** and can use the special jutsu in your next hunt!`;
            userInventory.isJutsuActive = true;
        } else {
            return interaction.reply(`❌ The item **${itemName}** cannot be used.`);
        }

        // Update the inventory and save the effect
        userInventory.quantity -= 1;
        await userInventory.save();

        const embed = new MessageEmbed()
            .setTitle('🧪 Item Used!')
            .setColor('#00FF00')
            .setDescription(effectDescription)
            .setFooter('Use wisely to maximize your gains!');

        return interaction.reply({ embeds: [embed] });
    }
};