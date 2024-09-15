const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cast')
        .setDescription('Craft special tools from your inventory.')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The name of the tool you want to craft (e.g., Comet Pickaxe, Aqua Rod).')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const toolName = interaction.options.getString('item');

        // Define recipes for crafting
        const castRecipes = {
            'Comet Pickaxe': [
                { name: 'Pickaxe', quantity: 1 },
                { name: 'Diamond', quantity: 1 },
                { name: 'Explosive Material', quantity: 1 }
            ],
            'Star Pickaxe': [
                { name: 'Pickaxe', quantity: 1 },
                { name: 'Star Gem', quantity: 1 }, // New rare item
                { name: 'Magnet', quantity: 1 }
            ],
            'Phoenix Pickaxe': [
                { name: 'Pickaxe', quantity: 1 },
                { name: 'Fire Gem', quantity: 1 }, // New rare item
                { name: 'Treasure Chest', quantity: 1 }
            ],
            'Aqua Rod': [
                { name: 'Fishing Rod', quantity: 1 },
                { name: 'Turtle', quantity: 1 },
                { name: 'Squid', quantity: 1 }
            ],
            'Mermaid Rod': [
                { name: 'Fishing Rod', quantity: 1 },
                { name: 'Whale', quantity: 1 },
                { name: 'Mermaid Gem', quantity: 1 } // New rare item
            ],
            'Tsunami Rod': [
                { name: 'Fishing Rod', quantity: 1 },
                { name: 'Water Gem', quantity: 1 }, // New rare item
                { name: 'Gift Box', quantity: 1 }
            ],
                // New Axe Recipes
    'Comet Axe': [
        { name: 'Axe', quantity: 1 },
        { name: 'Star Gem', quantity: 2 },
        { name: 'Comet Fragment', quantity: 3 }
    ],
    'Star Axe': [
        { name: 'Axe', quantity: 1 },
        { name: 'Diamond', quantity: 2 },
        { name: 'Star Fragment', quantity: 3 }
    ],
    'Sparkle Axe': [
        { name: 'Axe', quantity: 1 },
        { name: 'Sparkle Gem', quantity: 2 },
        { name: 'Rare Bark', quantity: 4 }
    ]
};
        

        const recipe = castRecipes[toolName];
        if (!recipe) {
            return interaction.reply('❌ Invalid item. Please provide a valid tool to cast.');
        }

        // Check if the user has all required items in inventory
        const missingItems = [];
        for (const ingredient of recipe) {
            const userItem = await Inventory.findOne({ where: { userId, itemName: ingredient.name } });
            if (!userItem || userItem.quantity < ingredient.quantity) {
                missingItems.push(`${ingredient.name} (x${ingredient.quantity})`);
            }
        }

        if (missingItems.length > 0) {
            return interaction.reply(`❌ You are missing the following items to cast **${toolName}**:\n${missingItems.join(', ')}`);
        }

        // Remove required items from inventory
        for (const ingredient of recipe) {
            const userItem = await Inventory.findOne({ where: { userId, itemName: ingredient.name } });
            userItem.quantity -= ingredient.quantity;
            if (userItem.quantity <= 0) {
                await userItem.destroy();
            } else {
                await userItem.save();
            }
        }

        // Add the new crafted tool to the user's inventory
        await Inventory.create({
            userId,
            itemName: toolName,
            quantity: 1
        });

        return interaction.reply(`✨ Congratulations! You have successfully crafted **${toolName}**.`);
    }
};