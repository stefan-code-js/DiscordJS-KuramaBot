const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Battle } = require('../models');
const { getBattleOutcome, updateLeaderboard } = require('../utils/battle');
const { emojis } = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chuninexam')
        .setDescription('Enter the Chunin Exams and battle other players.')
        .addUserOption(option => 
            option.setName('opponent')
                .setDescription('Challenge another player to a Chunin Exam battle')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const opponentId = interaction.options.getUser('opponent').id;

        const user = await User.findOne({ where: { userId } });
        const opponent = await User.findOne({ where: { userId: opponentId } });

        const battleResult = getBattleOutcome(user, opponent);

        // Update leaderboard for Chunin Exams
        updateLeaderboard(user, opponent, battleResult);

        const battleEmbed = new MessageEmbed()
            .setTitle('⚔️ Chunin Exam Battle!')
            .setDescription(battleResult.success 
                ? `🎉 **${interaction.user.username}** defeated **${interaction.options.getUser('opponent').username}**!`
                : `❌ **${interaction.user.username}** was defeated by **${interaction.options.getUser('opponent').username}**.`)
            .setColor(battleResult.success ? '#00FF00' : '#FF0000')
            .setFooter('Keep battling to advance your rank.');

        return interaction.reply({ embeds: [battleEmbed] });
    }
};