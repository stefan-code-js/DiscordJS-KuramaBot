const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, TeamHunt } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teamhunt')
        .setDescription('Form a team and go on a cooperative hunt.')
        .addUserOption(option => 
            option.setName('teammate')
                .setDescription('Invite a teammate to your hunt')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const teammateId = interaction.options.getUser('teammate').id;

        // Check if both users are available for a team hunt
        const user = await User.findOne({ where: { userId } });
        const teammate = await User.findOne({ where: { userId: teammateId } });

        if (!user || !teammate) {
            return interaction.reply('❌ Both players need to be available to start a team hunt.');
        }

        // Form the team and go on a hunt
        const teamHunt = await TeamHunt.create({
            userId1: userId,
            userId2: teammateId,
            success: Math.random() > 0.3,  // 70% chance of success
            rewardXP: Math.floor(Math.random() * 1000 + 500),
            rewardCoins: Math.floor(Math.random() * 2000 + 1000),
        });

        const embed = new MessageEmbed()
            .setTitle('🦊 Team Hunt Started!')
            .setColor('#FF4500')
            .setDescription(`You and **${interaction.options.getUser('teammate').username}** are hunting together! Let’s see what you find...`);

        // Simulate the hunt
        setTimeout(async () => {
            if (teamHunt.success) {
                user.xp += teamHunt.rewardXP;
                user.credits += teamHunt.rewardCoins;
                teammate.xp += teamHunt.rewardXP;
                teammate.credits += teamHunt.rewardCoins;

                await user.save();
                await teammate.save();

                const successEmbed = new MessageEmbed()
                    .setTitle('🎉 Team Hunt Success!')
                    .setColor('#00FF00')
                    .setDescription(`You both earned **${teamHunt.rewardXP} XP** and **${teamHunt.rewardCoins} coins**!`);
                return interaction.editReply({ embeds: [successEmbed] });
            } else {
                const failEmbed = new MessageEmbed()
                    .setTitle('💥 Team Hunt Failed!')
                    .setColor('#FF0000')
                    .setDescription('You were defeated during the hunt. Better luck next time!');
                return interaction.editReply({ embeds: [failEmbed] });
            }
        }, 5000);  // Simulate a 5-second delay for the hunt
    }
};