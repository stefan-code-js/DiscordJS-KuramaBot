const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');
const { randomizeFishingRewards, decreaseDurability } = require('../utils/currency');
const cooldowns = new Map(); // Cooldown system

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Go fishing and catch some rare fish!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Check for cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5-minute cooldown
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`🎣 You need to wait ${Math.ceil(timeLeft)} seconds before fishing again.`);
            }
        }

        // Check if user has a fishing rod
        const userInventory = await Inventory.findOne({ where: { userId, itemName: 'Fishing Rod' } });
        if (!userInventory || userInventory.durability <= 0) {
            return interaction.reply('🎣 You don\'t have a fishing rod, or your rod is broken. Buy one from the shop and equip it!');
        }

        // Randomize fishing rewards
        const { items, credits, xp } = randomizeFishingRewards(); 
        await decreaseDurability(userInventory); 

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
            });
        }));

        // Set cooldown
        cooldowns.set(userId, Date.now());

        // Create response format like in the provided screenshot
        let response = `🎣 While calmly fishing, you found `;
        response += items.map(item => `${item.icon} x${item.quantity}`).join(', ');
        response += ` and ${credits} credits!`;

        return interaction.reply(response);
    }
};