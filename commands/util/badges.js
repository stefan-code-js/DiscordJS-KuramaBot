const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Badge } = require('../models');
const { badgeIcons } = require('../utils/badgeIcons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badge')
        .setDescription('View your earned badges.'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const user = await User.findOne({ where: { userId }, include: Badge });

        if (!user || user.Badges.length === 0) {
            return interaction.reply('❌ You haven’t earned any badges yet!');
        }

        const badges = user.Badges.map(badge => `${badgeIcons[badge.name]} **${badge.name}**`).join('\n');

        const badgeEmbed = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s Badges`)
            .setColor('#FFD700')
            .setDescription(badges)
            .setFooter('Keep progressing to unlock more badges!');

        return interaction.reply({ embeds: [badgeEmbed] });
    }
};