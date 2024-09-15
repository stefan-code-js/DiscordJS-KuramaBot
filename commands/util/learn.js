const { SlashCommandBuilder } = require('@discordjs/builders');
const { Inventory, User } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('learn')
        .setDescription('Learn a new jutsu for hunting!')
        .addStringOption(option => 
            option.setName('jutsu')
                .setDescription('The type of jutsu to learn')
                .setRequired(true)
                .addChoices(
                    { name: 'Shadow Clone Jutsu', value: 'Shadow Clone Jutsu' },
                    { name: 'Fireball Jutsu', value: 'Fireball Jutsu' },
                    { name: 'Rasengan', value: 'Rasengan' }
                )),

    async execute(interaction) {
        const userId = interaction.user.id;
        const jutsu = interaction.options.getString('jutsu');

        // Check if the user has enough coins to learn the jutsu
        const user = await User.findOne({ where: { userId } });
        const cost = 5000;

        if (user.credits < cost) {
            return interaction.reply(`❌ You need **5000 coins** to learn **${jutsu}**.`);
        }

        // Deduct coins and add the jutsu to inventory
        user.credits -= cost;
        await user.save();

        await Inventory.create({
            userId,
            itemName: 'Jutsu',
            quantity: 1,
        });

        return interaction.reply(`✅ You have learned **${jutsu}**! You can now go hunting.`);
    }
};