const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');
const { randomizeChopRewards, decreaseDurability } = require('../utils/currency');
const cooldowns = new Map(); // Cooldown system

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chop')
        .setDescription('Go chop some wood and collect valuable resources!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Check for cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5-minute cooldown
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`🪓 You need to wait ${Math.ceil(timeLeft)} seconds before chopping again.`);
            }
        }

        // Check if user has an axe
        const userInventory = await Inventory.findOne({ where: { userId, itemName: 'Axe' } });
        if (!userInventory || userInventory.durability <= 0) {
            return interaction.reply('🪓 You don\'t have an axe, or your axe is broken. Buy one from the shop and equip it!');
        }

        // Randomize chop rewards
        const { items, credits, xp } = randomizeChopRewards(); 
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
        let response = `🪓 While chopping trees, you found `;
        response += items.map(item => `${item.icon} x${item.quantity}`).join(', ');
        response += ` and ${credits} credits!`;

        return interaction.reply(response);
    }
};