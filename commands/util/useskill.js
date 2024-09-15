const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Character, User } = require('../models');
const { useJutsu, levelUpJutsu } = require('../utils/jutsu');
const { emojis } = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('useskill')
        .setDescription('Use a character skill to boost your next hunt or battle.')
        .addStringOption(option => 
            option.setName('jutsu')
                .setDescription('Choose a jutsu to use')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const jutsuName = interaction.options.getString('jutsu');

        const user = await User.findOne({ where: { userId } });
        const character = await Character.findOne({ where: { userId } });

        // Use the chosen jutsu and get its effects
        const { success, xp, cooldown } = useJutsu(jutsuName, character);

        // Level up the jutsu if used successfully
        levelUpJutsu(jutsuName, user);

        const jutsuEmbed = new MessageEmbed()
            .setTitle(`🌀 ${jutsuName} Activated!`)
            .setDescription(success 
                ? `🎉 **${jutsuName}** successfully used, earning you **${xp} XP**!` 
                : `❌ **${jutsuName}** failed to execute. Try again after the cooldown.`)
            .setColor(success ? '#FFD700' : '#FF0000')
            .addField('Cooldown', `${cooldown} minutes`, true)
            .setFooter('Master your jutsu to unlock greater power.');

        return interaction.reply({ embeds: [jutsuEmbed] });
    }
};