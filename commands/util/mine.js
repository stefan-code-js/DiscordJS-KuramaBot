const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const mineIcons = require('../util/mineIcons'); // Icons for mining items
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mine')
    .setDescription('Mine for random items, coins, and XP with a 5-minute cooldown'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Cooldown logic (5 minutes)
    const cooldownTime = 5 * 60 * 1000;
    const lastMineTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastMineTime && now - lastMineTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastMineTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply(`⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before mining again.`);
    }

    // Update cooldown
    cooldowns.set(userId, now);

    // Fetch the user's profile or create one if it doesn't exist
    let userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      userProfile = await Users.create({
        userId,
        username: interaction.user.username,
        coins: 0,
        xp: 0,
        inventory: JSON.stringify({}),
      });
    }

    // Parse inventory
    let inventory = JSON.parse(userProfile.inventory || '{}');

    // Random mining rewards
    const items = mineIcons; // Assuming mineIcons returns an object like { gem: '💎', gold: '🥇' }
    const randomItemKeys = Object.keys(items);
    const foundItem = randomItemKeys[Math.floor(Math.random() * randomItemKeys.length)];
    const itemCount = Math.floor(Math.random() * 3) + 1; // Random between 1 and 3 items

    // Add found item to inventory
    if (inventory[foundItem]) {
      inventory[foundItem] += itemCount;
    } else {
      inventory[foundItem] = itemCount;
    }

    // Random coins and XP
    const coinsFound = Math.floor(Math.random() * 101) + 50; // Random coins between 50 and 150
    const xpGained = Math.floor(Math.random() * 31) + 10; // Random XP between 10 and 40

    // Update user's profile
    userProfile.coins += coinsFound;
    userProfile.xp += xpGained;
    userProfile.inventory = JSON.stringify(inventory);
    await userProfile.save();

    // Build response message without embed
    const itemEmoji = items[foundItem];
    const responseMessage = `
💎 **You found ${itemEmoji} x${itemCount} ${foundItem}(s) while mining!**
💰 You earned **${coinsFound}** credits and gained **${xpGained}** XP. Keep mining for more!
`;

    // Send the response message
    await interaction.reply(responseMessage);
  },
};
