const { SlashCommandBuilder } = require('@discordjs/builders');
<<<<<<< Updated upstream
const { User, Inventory } = require('../models');
const { randomizeLootRewards } = require('../utils/currency');
const cooldowns = new Map(); // Cooldown system

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loot')
        .setDescription('Loot for random items and credits!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Check for cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5-minute cooldown
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`🎉 You need to wait ${Math.ceil(timeLeft)} seconds before looting again.`);
            }
        }

        // Randomize loot rewards
        const { items, credits, xp } = randomizeLootRewards();

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
            });
        }));

        // Set cooldown
        cooldowns.set(userId, Date.now());

        // Create response format like in the provided screenshot
        let response = `🎉 Digging through messages, you found `;
        response += items.map(item => `${item.icon} x${item.quantity}`).join(', ');
        response += ` and ${credits} credits!`;

        return interaction.reply(response);
    }
};
=======
const { Users } = require('../../models');
const lootIcons = require('../util/lootIcons'); 
const { Equipment } = require('../../models');
// Adjust path to your project structure
const cooldowns = new Map();
module.exports = {
  data: new SlashCommandBuilder()
    .setName('loot')
    .setDescription('Loot for random items, coins, and XP with a 5-minute cooldown'),
  
  async execute(interaction) {
    const userId = interaction.user.id;

    // Cooldown logic
    const cooldownTime = 5 * 60 * 1000;
    const lastLootTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastLootTime && now - lastLootTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastLootTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply(`⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before looting again.`);
    }

    cooldowns.set(userId, now);

    // Fetch or create user profile
    let userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      userProfile = await Users.create({ userId, username: interaction.user.username, coins: 0, xp: 0, inventory: JSON.stringify({}) });
    }

    const inventory = JSON.parse(userProfile.inventory || '{}');
    const items = lootIcons;
    const foundItems = [];
    let itemText = '';

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
🔍 While looting, you uncovered a **Loot Crate**! 🧰
🔑 You need a key to unlock it. Keep collecting keys or visit the shop to get more!
✨ The crate might hold something rare. Keep an eye out!
`;
      await interaction.reply(crateFoundMessage);
    } else {
      const responseMessage = `
🔍 **While looting, you found:** ${itemText}
💰 You earned \`${coinsFound}\` coins and gained \`${randomXP}\` XP. Keep looting for more!
`;
      await interaction.reply(responseMessage);
    }

    userProfile.inventory = JSON.stringify(inventory);
    await userProfile.save();
  },
};
>>>>>>> Stashed changes
