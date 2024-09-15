const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');
const { randomizeFishingRewards, decreaseDurability } = require('../utils/currency');
const cooldowns = new Map(); // Cooldown for fishing

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Go fishing to catch some rare fish and earn rewards!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Cooldown logic
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5 minutes cooldown
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`🎣 You need to wait ${Math.ceil(timeLeft)} seconds before fishing again.`);
            }
        }

        // Check if the user has a fishing rod
        const userInventory = await Inventory.findOne({ where: { userId, itemName: 'Fishing Rod' } });
        if (!userInventory || userInventory.durability <= 0) {
            return interaction.reply('🎣 You don\'t have a fishing rod, or your rod is broken. Buy one from the shop and equip it!');
        }

        // Process fishing action
        const { items, credits, xp } = randomizeFishingRewards(); // Random fishing rewards
        await decreaseDurability(userInventory); // Decrease rod durability

        // Update user's profile (credits, XP)
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
                durability: item.durability || null,
            });
        }));

        // Set cooldown
        cooldowns.set(userId, Date.now());

        // Visual response
        let response = `🎣 You caught the following fish:\n`;
        response += items.map(item => `${item.icon} x${item.quantity}`).join(', ');
        response += `\n💰 You also earned ${credits} credits and gained ${xp} XP!`;

        // Send response
        return interaction.reply({ content: response });
    }
};