const { SlashCommandBuilder } = require('@discordjs/builders');
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