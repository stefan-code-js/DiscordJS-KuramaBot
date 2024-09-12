const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models'); // Assuming Users is your database model for users
const lootIcons = require('../util/lootIcons'); // Assuming this returns your loot icons
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loot')
    .setDescription('Loot for random items, coins, and XP with a 5-minute cooldown'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Cooldown logic (5 minutes)
    const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const lastLootTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastLootTime && now - lastLootTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastLootTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply({ content: `⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before looting again.`, ephemeral: true });
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

      // Random items, credits, and XP
      const items = lootIcons;
      const randomItemKeys = Object.keys(items);
      const foundItems = [];
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

      // Random credits and XP rewards
      const creditsFound = Math.floor(Math.random() * 101) + 50; // Random credits between 50 and 150
      const randomXP = Math.floor(Math.random() * 31) + 10; // Random XP between 10 and 40

      // Update the user's profile with credits, XP, and the updated inventory
      userProfile.coins += creditsFound;
      userProfile.xp += randomXP;
      userProfile.inventory = JSON.stringify(inventory); // Save the updated inventory as JSON

      await userProfile.save(); // Save the updated user profile

      // Build the response message
      const responseMessage = `
🎉 Looting, you found ${itemText} along with \`${creditsFound}\` credits!

✨ You earned ${creditsFound} credits and gained ${randomXP} XP. Keep looting for more!
`;

      // Send the response message
      await interaction.reply(responseMessage);

    } catch (error) {
      console.error('Error executing command loot:', error);
      return interaction.reply('An error occurred while looting. Please try again later.');
    }
  },
};