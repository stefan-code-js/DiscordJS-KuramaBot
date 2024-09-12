const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const mineIcons = require('../util/mineIcons'); // Adjust path as per your project structure
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mine')
    .setDescription('Mine for random items, coins, and XP with a 5-minute cooldown'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;

      // Cooldown logic (5 minutes)
      const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
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

      // Fetch or create the user's profile
      let userProfile = await Users.findOne({ where: { userId } });

      if (!userProfile) {
        // If the user profile doesn't exist, create one
        userProfile = await Users.create({
          userId,
          username: interaction.user.username,
          coins: 0,
          xp: 0,
          inventory: JSON.stringify({}), // Initialize empty inventory
        });
      }

      // Parse the user's inventory
      let inventory = JSON.parse(userProfile.inventory || '{}');

      // Random items, coins, and XP
      const items = mineIcons; // Assuming mineIcons returns an object like { diamond: '💎', gold: '🥇' }
      const randomItemKeys = Object.keys(items);
      const foundItem = randomItemKeys[Math.floor(Math.random() * randomItemKeys.length)];
      const itemCount = Math.floor(Math.random() * 3) + 1; // Randomly find between 1 and 3 items

      // Add the found item to the inventory
      if (inventory[foundItem]) {
        inventory[foundItem] += itemCount;
      } else {
        inventory[foundItem] = itemCount;
      }

      // Random coins and XP rewards
      const coinsFound = Math.floor(Math.random() * 101) + 50; // Random coins between 50 and 150
      const randomXP = Math.floor(Math.random() * 31) + 10; // Random XP between 10 and 40

      // Update the user's profile with coins, XP, and the updated inventory
      userProfile.coins += coinsFound;
      userProfile.xp += randomXP;
      userProfile.inventory = JSON.stringify(inventory); // Save the updated inventory as JSON

      await userProfile.save(); // Save the updated user profile

      // Build the response message
      const itemEmoji = items[foundItem];
      const responseMessage = `
        💎 **You found ${itemCount} ${foundItem}(s) while mining!**
        ⛏️ You earned \`${coinsFound}\` coins and gained \`${randomXP}\` XP. Keep mining for more!
      `;

      // Send the response message
      await interaction.reply(responseMessage);

    } catch (error) {
      console.error('Error executing command mine:', error);
      return interaction.reply('An error occurred while mining. Please try again later.');
    }
  },
};
