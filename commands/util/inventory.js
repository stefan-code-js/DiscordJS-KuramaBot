const { SlashCommandBuilder } = require('@discordjs/builders');
<<<<<<< Updated upstream
const { Inventory } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Manage your inventory.')
        .addSubcommand(subcommand => 
            subcommand
                .setName('show')
                .setDescription('Show all items in your inventory.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('sort')
                .setDescription('Sort your inventory.')
                .addStringOption(option => 
                    option.setName('type')
                        .setDescription('Sort by type: alphabetically, by quantity, or by rarity.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'alphabetically', value: 'alphabetically' },
                            { name: 'quantity', value: 'quantity' },
                            { name: 'rarity', value: 'rarity' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Search for a specific item in your inventory.')
                .addStringOption(option => 
                    option.setName('item')
                        .setDescription('The name of the item to search for.')
                        .setRequired(true))
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();
        const inventory = await Inventory.findAll({ where: { userId } });

        if (inventory.length === 0) {
            return interaction.reply('❌ Your inventory is empty.');
        }

        if (subcommand === 'show') {
            // Format the inventory as itemIcon xQuantity
            const formattedInventory = inventory.map(item => `${item.icon} x${item.quantity}`).join(', ');
            return interaction.reply(`🎒 Your inventory: ${formattedInventory}`);
        }

        if (subcommand === 'sort') {
            const sortType = interaction.options.getString('type');

            let sortedInventory;
            if (sortType === 'alphabetically') {
                sortedInventory = inventory.sort((a, b) => a.itemName.localeCompare(b.itemName));
            } else if (sortType === 'quantity') {
                sortedInventory = inventory.sort((a, b) => b.quantity - a.quantity);
            } else if (sortType === 'rarity') {
                // Assuming we have rarity in the item data, we sort by rarity
                sortedInventory = inventory.sort((a, b) => a.rarity - b.rarity);
            }

            const formattedInventory = sortedInventory.map(item => `${item.icon} x${item.quantity}`).join(', ');
            return interaction.reply(`🎒 Sorted inventory: ${formattedInventory}`);
        }

        if (subcommand === 'search') {
            const searchItem = interaction.options.getString('item');
            const foundItem = inventory.find(item => item.itemName.toLowerCase() === searchItem.toLowerCase());

            if (!foundItem) {
                return interaction.reply(`❌ Item "${searchItem}" not found in your inventory.`);
            }

            return interaction.reply(`🔍 Found: ${foundItem.icon} **${foundItem.itemName}** x${foundItem.quantity}`);
        }
    }
};
=======
const { Users } = require('../../models');
const inventoryIcons = require('../util/inventoryIcons');  // Adjust path to your icons file
const shopItems = require('../util/shopItems');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Manage your inventory')
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription('Shows your inventory or another user\'s')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to view the inventory of')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('brief')
        .setDescription('Shows a brief version of your inventory')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('calculate')
        .setDescription('Calculates the worth of your inventory or another user\'s')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to calculate the inventory of')
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    let targetUser = interaction.options.getUser('user') || interaction.user;

    // Fetch the target user's profile
    let userProfile = await Users.findOne({ where: { userId: targetUser.id } });
    if (!userProfile) {
      return interaction.reply({ content: `${targetUser.username} does not have a profile yet.`, ephemeral: true });
    }

    const inventory = JSON.parse(userProfile.inventory || '{}');

    if (subcommand === 'show') {
      // Combine duplicate items and stack them
      const stackedInventory = Object.entries(inventory).reduce((acc, [item, count]) => {
        if (typeof count === 'object') {
          count = count.count || 0;
        }
        acc[item] = (acc[item] || 0) + count;
        return acc;
      }, {});

      // Display full inventory with icons and stacked amounts
      const inventoryDisplay = Object.entries(stackedInventory)
        .map(([item, count]) => `${inventoryIcons[item] || '❓'} x${count}`)
        .join(', ');

      return interaction.reply({ content: `${targetUser.username}'s Inventory:\n${inventoryDisplay}` });
    }

    if (subcommand === 'brief') {
      // Display a brief version (only item names with icons)
      const inventoryDisplay = Object.keys(inventory)
        .map(item => `${inventoryIcons[item] || '❓'}`)
        .join(', ');

      return interaction.reply({ content: `${targetUser.username}'s Brief Inventory: ${inventoryDisplay}` });
    }

    if (subcommand === 'calculate') {
      // Calculate total worth of the inventory
      const totalWorth = Object.keys(inventory).reduce((total, item) => {
        // Assuming each item has a predefined value in your shopItems or a similar place
        return total + (shopItems[item]?.value || 0) * inventory[item];
      }, 0);

      return interaction.reply({ content: `${targetUser.username}'s inventory is worth ${totalWorth} coins.` });
    }
  }
};
>>>>>>> Stashed changes
