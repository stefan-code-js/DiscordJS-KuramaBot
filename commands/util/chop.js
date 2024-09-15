const { SlashCommandBuilder } = require('@discordjs/builders');
<<<<<<< Updated upstream
const { User, Inventory } = require('../models');
const { randomizeChopRewards, decreaseDurability } = require('../utils/currency');
const cooldowns = new Map(); // Cooldown system
=======
const { Users } = require('../../models');
const chopIcons = require('../util/chopIcons'); // Chopping icons
const cooldowns = new Map();
const { Equipment } = require('../../models');
>>>>>>> Stashed changes

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chop')
        .setDescription('Go chop some wood and collect valuable resources!'),

    async execute(interaction) {
        const userId = interaction.user.id;

<<<<<<< Updated upstream
        // Check for cooldown
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 300000; // 5-minute cooldown
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply(`🪓 You need to wait ${Math.ceil(timeLeft)} seconds before chopping again.`);
            }
=======
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
    async function useAxe(userId) {
      const axe = await Equipment.findOne({ where: { userId, type: 'axe' } });
    
      if (!axe || axe.durability <= 0) {
        return 'Your axe is broken! You need to repair or buy a new one.';
      }
    
      // Decrease durability
      axe.durability -= 10;
      await axe.save();
    
      return `You used your axe. Remaining durability: ${axe.durability}%`;
    }
    
    // In the command execution
    const result = await useAxe(userId);
    interaction.reply(result);
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
   // Check if the user has the required equipment
   const equipment = await Equipment.findOne({ where: { userId } });
   if (!equipment || !equipment.axe) {
     return interaction.reply({ content: 'You cannot chop trees without an axe!', ephemeral: true });
   }

        // Add found items to the inventory
        if (inventory[foundItem]) {
          inventory[foundItem] += itemCount;
        } else {
          inventory[foundItem] = itemCount;
>>>>>>> Stashed changes
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