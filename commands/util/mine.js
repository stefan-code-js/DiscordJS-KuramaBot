const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');
const { randomizeMiningRewards, decreaseDurability } = require('../utils/currency');
const { MessageActionRow, MessageButton } = require('discord.js');
const cooldowns = new Map(); // To handle command cooldowns.

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mine')
        .setDescription('Mine for valuable minerals and items.'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Check for cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5 minutes cooldown
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`⛏️ You need to wait ${Math.ceil(timeLeft)} seconds before mining again.`);
            }
        }

        // Check if user has a pickaxe
        const userInventory = await Inventory.findOne({ where: { userId, itemName: 'Pickaxe' } });
        if (!userInventory || userInventory.durability <= 0) {
            return interaction.reply('⛏️ You don\'t have a pickaxe, or your pickaxe is broken. Buy one from the shop and equip it!');
        }

        // Process mining action
        const { items, credits, xp } = randomizeMiningRewards(); // Helper function to get random items, credits, and XP
        await decreaseDurability(userInventory); // Decrease pickaxe durability

        // Update user profile (credits, XP)
        const user = await User.findOne({ where: { userId } });
        user.credits += credits;
        user.xp += xp;
        await user.save();

        // Add items to inventory
        await Promise.all(items.map(async (item) => {
            await Inventory.create({
                userId,
                itemName: item.name,
                quantity: item.quantity,
                durability: item.durability || null, // If applicable
            });
        }));

        // Set cooldown
        cooldowns.set(userId, Date.now());

        // Create a visual message
        let response = `⛏️ You mined and found the following:\n`;
        response += items.map(item => `${item.icon} x${item.quantity}`).join(', ');
        response += `\n💰 You also found ${credits} credits and earned ${xp} XP!`;

        // Send response
        return interaction.reply({ content: response });
    }
};