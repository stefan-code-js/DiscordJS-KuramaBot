const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chakra')
        .setDescription('View your chakra status and regenerate chakra.'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Fetch user's chakra stats
        const user = await User.findOne({ where: { userId } });

        const embed = new MessageEmbed()
            .setTitle('🌊 Chakra Control')
            .setColor('#1E90FF')
            .setDescription(`🌀 **Chakra**: ${user.chakra}/100\nYou can regenerate chakra over time or use potions to restore it.`)
            .setFooter('Use chakra wisely to execute jutsu and skills!');

        return interaction.reply({ embeds: [embed] });
    }
};