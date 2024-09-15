const { SlashCommandBuilder } = require('@discordjs/builders');
const { Achievement } = require('../models');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('Displays the badges you have earned.'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Fetch the user's badges
        const userBadges = await Achievement.findAll({ where: { userId } });
        if (userBadges.length === 0) {
            return interaction.reply('You haven\'t earned any badges yet. Keep playing to unlock them!');
        }

        // Create a formatted list of badges
        const badgesList = userBadges.map(badge => `${badge.badgeIcon} **${badge.badgeName}**`).join('\n');

        // Create an embed to display the badges
        const badgesEmbed = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s Badges`)
            .setColor('#FFD700') // Gold color for achievements
            .setDescription(badgesList)
            .setFooter('Keep up the good work!');

        return interaction.reply({ embeds: [badgesEmbed] });
    }
};