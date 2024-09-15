const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');
const { randomizeLootRewards } = require('../utils/currency');
const cooldowns = new Map(); // Map to store user cooldowns for looting.

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loot')
        .setDescription('Loot for random items and credits!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Check for cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5 minutes
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`🎉 You need to wait ${Math.ceil(timeLeft)} seconds before looting again.`);
            }
        }

        // Process looting
        const { items, credits, xp } = randomizeLootRewards(); // Get random items, credits, and XP

        // Update user's profile (credits, XP)
        const user = await User.findOne({ where: { userId } });
        user.credits += credits;
        user.xp += xp;
        await user.save();

        // Add items to user's inventory
        await Promise.all(items.map(async (item) => {
            await Inventory.create({
                userId,
                itemName: item.name,
                quantity: item.quantity,
            });
        }));

        // Set cooldown
        cooldowns.set(userId, Date.now());

        // Format response with rewards
        let response = `🎉 You looted and found:\n`;
        response += items.map(item => `${item.icon} x${item.quantity}`).join(', ');
        response += `\n💰 You also found ${credits} credits and gained ${xp} XP!`;

        // Send response to user
        return interaction.reply({ content: response });
    }
};