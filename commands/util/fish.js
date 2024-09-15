const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
<<<<<<< Updated upstream
const fishIcons = require('../util/fishIcons'); // Adjust path as per your project structure
=======
const fishIcons = require('../util/fishIcons'); // Adjust path to your project structure
>>>>>>> Stashed changes
const cooldowns = new Map();
const { Equipment } = require('../../models');

module.exports = {
<<<<<<< Updated upstream
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
=======
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Fish for random items, coins, and XP with a 5-minute cooldown'),
  
  async execute(interaction) {
    const userId = interaction.user.id;

    // Cooldown logic
    const cooldownTime = 5 * 60 * 1000;
    const lastFishTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastFishTime && now - lastFishTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastFishTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply(`⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before fishing again.`);
    }

    cooldowns.set(userId, now);
 // Check if the user has the required equipment
 const equipment = await Equipment.findOne({ where: { userId } });
 if (!equipment || !equipment.fishingRod) {
   return interaction.reply({ content: 'You cannot fish without a fishing rod!', ephemeral: true });
 }

    // Fetch or create user profile
    let userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      userProfile = await Users.create({ userId, username: interaction.user.username, coins: 0, xp: 0, inventory: JSON.stringify({}) });
    }

    const inventory = JSON.parse(userProfile.inventory || '{}');
    const items = fishIcons;
    const foundItems = [];
    let itemText = '';
    const { Equipment } = require('../../models');

    async function useFishingRod(userId) {
      const fishingRod = await Equipment.findOne({ where: { userId, type: 'fishingrod' } });
    
      if (!fishingRod || fishingRod.durability <= 0) {
        return 'Your fishing rod is broken! You need to repair or buy a new one.';
      }
    
      // Decrease durability
      fishingRod.durability -= 10;
      await fishingRod.save();
    
      return `You used your fishing rod. Remaining durability: ${fishingRod.durability}%`;
    }
    
    // In the command execution
    const result = await useFishingRod(userId);
    interaction.reply(result);

    // Generate random items (between 4-7)
    for (let i = 0; i < Math.floor(Math.random() * 4) + 4; i++) {
      const foundItem = Object.keys(items)[Math.floor(Math.random() * Object.keys(items).length)];
      const itemCount = Math.floor(Math.random() * 2) + 1;

      foundItems.push({ item: foundItem, count: itemCount });

      inventory[foundItem] = (inventory[foundItem] || 0) + itemCount;
      const itemEmoji = items[foundItem];
      itemText += `${itemEmoji} x${itemCount}, `;
    }
    itemText = itemText.slice(0, -2);

    // Random rewards (coins and XP)
    const coinsFound = Math.floor(Math.random() * 101) + 50;
    const randomXP = Math.floor(Math.random() * 31) + 10;
    userProfile.coins += coinsFound;
    userProfile.xp += randomXP;

    // Crate logic
    const foundCrate = Math.random() > 0.8; // 20% chance to find a crate
    if (foundCrate) {
      const crateFoundMessage = `
🎣 While fishing, you caught a **Fishing Crate**! 🧰
🔑 You need a key to unlock it. Keep collecting keys or visit the shop to get more!
✨ The crate might hold something rare. Keep an eye out!
`;
      await interaction.reply(crateFoundMessage);
    } else {
      const responseMessage = `
🎣 **While fishing, you found:** ${itemText}
💰 You earned \`${coinsFound}\` coins and gained \`${randomXP}\` XP. Keep fishing for more!
`;
      await interaction.reply(responseMessage);
    }

    userProfile.inventory = JSON.stringify(inventory);
    await userProfile.save();
  },
};
>>>>>>> Stashed changes
