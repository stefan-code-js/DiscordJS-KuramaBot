const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Character } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hunt-profile')
        .setDescription('View your profile and character stats.'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Fetch user profile and character details
        const user = await User.findOne({ where: { userId } });
        const character = await Character.findOne({ where: { userId } });

        if (!character) {
            return interaction.reply('❌ You have not chosen a character yet. Use `/choosecharacter` to select one.');
        }

        // Create an embed for the character profile
        const profileEmbed = new MessageEmbed()
            .setTitle(`👤 ${interaction.user.username}'s Profile`)
            .setColor('#00FF00')
            .addField('🦸 Character', character.characterName)
            .addField('💪 Ability', character.ability)
            .addField('⭐ XP', user.xp.toString())
            .addField('💰 Coins', user.credits.toString())
            .setFooter('Keep progressing to unlock more rewards and increase your power!');

        return interaction.reply({ embeds: [profileEmbed] });
    }
};