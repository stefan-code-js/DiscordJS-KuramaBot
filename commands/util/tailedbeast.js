const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, TailedBeast } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tailedbeast')
        .setDescription('Challenge a Tailed Beast for massive rewards.')
        .addStringOption(option => 
            option.setName('beast')
                .setDescription('Choose a tailed beast to challenge')
                .setRequired(true)
                .addChoices(
                    { name: 'Kurama (Nine-Tails)', value: 'Kurama' },
                    { name: 'Shukaku (One-Tail)', value: 'Shukaku' },
                    { name: 'Matatabi (Two-Tails)', value: 'Matatabi' }
                )),

    async execute(interaction) {
        const userId = interaction.user.id;
        const beastName = interaction.options.getString('beast');

        const beastStats = {
            Kurama: { difficulty: 10, reward: 'Nine-Tails Chakra Fragment', xp: 5000, coins: 10000 },
            Shukaku: { difficulty: 8, reward: 'One-Tail Sand Cloak', xp: 3000, coins: 7000 },
            Matatabi: { difficulty: 9, reward: 'Two-Tails Fireball Cloak', xp: 4000, coins: 8000 }
        };

        const beast = beastStats[beastName];
        const playerSkill = Math.random() * 10;

        let result;
        if (playerSkill >= beast.difficulty) {
            result = `🎉 You have defeated **${beastName}** and earned the **${beast.reward}**! You also gain **${beast.xp} XP** and **${beast.coins} coins**.`;
            // Update user rewards
            const user = await User.findOne({ where: { userId } });
            user.xp += beast.xp;
            user.credits += beast.coins;
            await user.save();
        } else {
            result = `❌ You failed to defeat **${beastName}**. Better luck next time!`;
        }

        const embed = new MessageEmbed()
            .setTitle('

🦊 Tailed Beast Encounter!')
            .setColor('#FF4500')
            .setDescription(result)
            .setFooter('Keep challenging Tailed Beasts for more powerful rewards.');

        return interaction.reply({ embeds: [embed] });
    }
};