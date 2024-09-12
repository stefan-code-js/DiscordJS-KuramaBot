const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const fishIcons = require('../util/fishIcons'); // Icons for fishing items
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Fish for random items, coins, and XP with a 5-minute cooldown'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Cooldown logic (5 minutes)
    const cooldownTime = 5 * 60 * 1000;
    const lastFishTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastFishTime && now - lastFishTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastFishTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply(`⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before fishing again.`);
    }

    // Update cooldown
    cooldowns.set(userId, now);

    try {
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

      // Random fishing rewards
      const items = fishIcons; // Assuming fishIcons returns an object like { fish: '🐟', treasure: '🏆' }
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
🎣 **You caught ${itemEmoji} x${itemCount} ${foundItem}(s) while fishing!**
💰 You earned **${coinsFound}** credits and gained **${xpGained}** XP. Keep fishing for more!
`;

      // Send the response message
      await interaction.reply(responseMessage);

    } catch (error) {
      console.error('Error executing command fish:', error);
      return interaction.reply('An error occurred while fishing. Please try again later.');
    }
  },
};
