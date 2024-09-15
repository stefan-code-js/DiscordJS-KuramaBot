const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const mopIcons = require('../util/mopIcons'); // Mop-related icons
const cooldowns = new Map();
const { Equipment } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mop')
    .setDescription('Clean the chat and find random items, coins, and XP with a 5-minute cooldown'),

  async execute(interaction) {
    const userId = interaction.user.id;

    async function useMop(userId) {
      const mop = await Equipment.findOne({ where: { userId, type: 'mop' } });
    
      if (!mop || mop.durability <= 0) {
        return 'Your mop is broken! You need to repair or buy a new one.';
      }
    
      // Decrease durability
      mop.durability -= 10;
      await mop.save();
    
      return `You used your mop. Remaining durability: ${mop.durability}%`;
    }
    
    // In the command execution
    const result = await useMop(userId);
    interaction.reply(result);
    // Check if the user has the required equipment
    const equipment = await Equipment.findOne({ where: { userId } });
    if (!equipment || !equipment.mop) {
      return interaction.reply({ content: 'You cannot mop without a mop!', ephemeral: true });
    }
    // Cooldown logic (5 minutes)
    const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const lastMopTime = cooldowns.get(userId);
    const now = Date.now();

    if (lastMopTime && now - lastMopTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastMopTime);
      const minutesLeft = Math.floor(remainingTime / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
      return interaction.reply(`⏳ You need to wait **${minutesLeft} minutes and ${secondsLeft} seconds** before mopping again.`);
    }

    cooldowns.set(userId, now);

    // Fetch or create the user's profile
    let userProfile = await Users.findOne({ where: { userId } });

    if (!userProfile) {
      userProfile = await Users.create({
        userId,
        username: interaction.user.username,
        coins: 0,
        xp: 0,
        inventory: JSON.stringify({})
      });
    }

    // Parse the user's current inventory
    let inventory = JSON.parse(userProfile.inventory || '{}');

    // Random items, coins, and XP
    const items = mopIcons;
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
      itemText += `${itemEmoji} x${itemCount}, `;
    }

    // Trim the last comma and space from itemText
    itemText = itemText.slice(0, -2);

    // Random coins and XP rewards
    const coinsFound = Math.floor(Math.random() * 101) + 50; // Random coins between 50 and 150
    const randomXP = Math.floor(Math.random() * 31) + 10; // Random XP between 10 and 40

    // Update the user's profile with coins, XP, and the updated inventory
    userProfile.coins += coinsFound;
    userProfile.xp += randomXP;
    userProfile.inventory = JSON.stringify(inventory); // Save the updated inventory as JSON

    await userProfile.save(); // Save the updated user profile

    // Build the interactive and fun response message
    const mopEmoji = '🧹';
    const sparkleEmoji = '✨';
    const coinEmoji = '💰';
    const xpEmoji = '✨';
    const responseMessage = `
${mopEmoji} **While mopping the chat, you helped clean up and found the following items!**:
${itemText}

${coinEmoji} **Coins Earned**: \`+${coinsFound}\`
${xpEmoji} **XP Earned**: \`+${randomXP}\`

${sparkleEmoji} Keep mopping to clean up more mess and discover hidden treasures!
    `;

    // Send the response message
    await interaction.reply(responseMessage);
  },
};
