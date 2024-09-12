const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const inventoryIcons = require('../util/inventoryIcons'); // This now combines all icons from different sources
const { prefix } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your inventory'),

  async execute(interaction) {
    const userId = interaction.user.id;
    let userProfile = await Users.findOne({ where: { userId } });

    if (!userProfile) {
      return interaction.reply({ content: 'You need to create a profile first.', ephemeral: true });
    }

    // Parse inventory
    const inventory = JSON.parse(userProfile.inventory || '{}');

    // Log the inventory for debugging
    console.log("Full inventory:", JSON.stringify(inventory, null, 2));

    // Prepare the inventory display with icons
    const inventoryDisplay = Object.entries(inventory).map(([itemName, itemData]) => {
      // Get the icon for the item from inventoryIcons.js, fallback to a default icon if it doesn't exist
      const itemIcon = inventoryIcons[itemName.toLowerCase()] || '❓'; // Use '❓' as fallback for unknown items

      if (typeof itemData === 'object' && itemData !== null) {
        return `${itemIcon} x${itemData.count} (Durability: ${itemData.durability})`;
      }

      // Simple items (not objects)
      return `${itemIcon} x${itemData}`;
    }).join(', ');

    const inventoryMessage = inventoryDisplay.length > 0
      ? `🧰 **Your Inventory:**\n${inventoryDisplay}`
      : 'Your inventory is empty. Try mining, fishing, chopping, or looting to collect items!';

    await interaction.reply({ content: inventoryMessage, ephemeral: true });
  }
};
