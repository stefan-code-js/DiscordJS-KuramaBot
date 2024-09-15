const { SlashCommandBuilder } = require('@discordjs/builders');
const { ShopItem, User, Inventory } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy an item from the shop.')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The name of the item you want to buy.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const itemName = interaction.options.getString('item');

        // Fetch the item from the shop
        const item = await ShopItem.findOne({ where: { name: itemName } });
        if (!item) {
            return interaction.reply('❌ That item is not available in the shop.');
        }

        // Fetch the user's profile
        const user = await User.findOne({ where: { userId } });
        if (!user || user.credits < item.buyPrice) {
            return interaction.reply('❌ You do not have enough credits to buy this item.');
        }

        // Deduct the item's cost from the user's credits
        user.credits -= item.buyPrice;
        await user.save();

        // Add the item to the user's inventory
        await Inventory.create({
            userId,
            itemName: item.name,
            quantity: 1,
        });

        return interaction.reply(`✅ You purchased **${item.name}** for ${item.buyPrice} credits!`);
    }
};