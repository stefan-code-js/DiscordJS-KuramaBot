const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const chopIcons = require('../util/chopIcons'); // Chopping icons
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chop')
    .setDescription('Chop for wood, items, coins, and XP with a 5-minute cooldown'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Cooldown logic (5 minutes)
    const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const lastChopTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastChopTime && now - lastChopTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastChopTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply({ content: `⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before chopping again.`, ephemeral: true });
    }

    // Update cooldown
    cooldowns.set(userId, now);

    try {
      // Fetch or create the user's profile
      let userProfile = await Users.findOne({ where: { userId } });

      // If no user profile exists, create one
      if (!userProfile) {
        userProfile = await Users.create({
          userId,
          username: interaction.user.username,
          coins: 0,
          xp: 0,
          inventory: JSON.stringify({}) // Initialize empty inventory
        });
      }

      // Parse the user's current inventory
      let inventory = JSON.parse(userProfile.inventory || '{}');

      // Random items, coins, and XP
      const items = chopIcons;
      const randomItemKeys = Object.keys(items);
      const foundItems = []; // To store found items for this chopping session
      let itemText = '';

      // Loop to generate between 1 to 3 random items
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        const foundItem = randomItemKeys[Math.floor(Math.random() * randomItemKeys.length)];
        const itemCount = Math.floor(Math.random() * 2) + 1; // Randomly find 1 or 2 of the same item

        foundItems.push({ item: foundItem, count: itemCount });

        // Add found items to the inventory
        if (inventory[foundItem]) {
          inventory[foundItem] += itemCount;
        } else {
          inventory[foundItem] = itemCount;
        }

        // Add to the itemText for the response message
        const itemEmoji = items[foundItem];
        itemText += `${itemEmoji} x ${itemCount}, `;
      }

      // Trim last comma and space
      itemText = itemText.slice(0, -2);

      // Random coins and XP rewards
      const coinsFound = Math.floor(Math.random() * 101) + 50; // Random coins between 50 and 150
      const randomXP = Math.floor(Math.random() * 31) + 10; // Random XP between 10 and 40

      // Update the user's profile with coins, XP, and the updated inventory
      userProfile.coins += coinsFound;
      userProfile.xp += randomXP;
      userProfile.inventory = JSON.stringify(inventory); // Save the updated inventory as JSON

      await userProfile.save(); // Save the updated user profile

      // Build the response message
      const responseMessage = `
🪓 While chopping trees, you found ${itemText} and \`${coinsFound}\` credits using an **Axe** and you proceed to save them into your inventory.

✨ You earned ${coinsFound} coins and gained ${randomXP} XP. Keep chopping for more!
`;

      // Send the response message
      await interaction.reply(responseMessage);

    } catch (error) {
      console.error('Error executing command chop:', error);
      return interaction.reply('An error occurred while chopping. Please try again later.');
    }
  },
};
