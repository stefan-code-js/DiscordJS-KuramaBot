const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const fishIcons = require('../util/fishIcons'); // Adjust path as per your project structure
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Go fishing and catch some rare fish!'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;

      // Cooldown logic (5 minutes)
      const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
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
      const items = fishIcons; // Assuming fishIcons returns an object like { fish: '🐟', treasure: '🏆' }
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
        🎣 **You caught ${itemCount} ${foundItem}(s) while fishing!**
        🐟 You earned \`${coinsFound}\` coins and gained \`${randomXP}\` XP. Keep fishing for more!
      `;

      // Send the response message
      await interaction.reply(responseMessage);

    } catch (error) {
      console.error('Error executing command fish:', error);
      return interaction.reply('An error occurred while fishing. Please try again later.');
    }
};