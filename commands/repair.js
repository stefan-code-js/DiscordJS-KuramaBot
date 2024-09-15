const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Inventory } = require('../models');
const { repairItem } = require('../utils/durability');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repair')
        .setDescription('Repair a tool in your inventory.')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('The name of the item you want to repair.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const itemName = interaction.options.getString('item');

        // Check if the user has a Repair Wrench
        const userInventory = await Inventory.findOne({ where: { userId, itemName: 'Repair Wrench' } });
        if (!userInventory) {
            return interaction.reply('❌ You need a Repair Wrench to repair items. Buy one from the shop.');
        }

        // Attempt to repair the item
        const { success, message } = await repairItem(userId, itemName);
        if (!success) {
            return interaction.reply(message);
        }

        // Reduce the number of Repair Wrenches after use
        if (userInventory.quantity > 1) {
            userInventory.quantity -= 1;
            await userInventory.save();
        } else {
            await userInventory.destroy();
        }

        return interaction.reply(`🔧 ${message}`);
    }
};