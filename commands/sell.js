const { SlashCommandBuilder } = require('@discordjs/builders');
const { ShopItem, User, Inventory } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sell an item from your inventory.')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The name of the item you want to sell.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const itemName = interaction.options.getString('item');

        // Fetch the item from the user's inventory
        const userItem = await Inventory.findOne({ where: { userId, itemName } });
        if (!userItem) {
            return interaction.reply('❌ You do not have this item in your inventory.');
        }

        // Fetch the item price from the shop
        const item = await ShopItem.findOne({ where: { name: itemName } });
        if (!item) {
            return interaction.reply('❌ This item cannot be sold.');
        }

        // Add the sell price to the user's credits
        const user = await User.findOne({ where: { userId } });
        user.credits += item.sellPrice;
        await user.save();

        // Remove the item from the user's inventory
        if (userItem.quantity > 1) {
            userItem.quantity -= 1;
            await userItem.save();
        } else {
            await userItem.destroy();
        }

        return interaction.reply(`✅ You sold **${item.name}** for ${item.sellPrice} credits!`);
    }
};