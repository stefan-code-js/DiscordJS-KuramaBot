const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Character } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choosecharacter')
        .setDescription('Choose your character for the Naruto hunt!')
        .addStringOption(option => 
            option.setName('character')
                .setDescription('Choose your character')
                .setRequired(true)
                .addChoices(
                    { name: 'Naruto Uzumaki', value: 'Naruto' },
                    { name: 'Sasuke Uchiha', value: 'Sasuke' },
                    { name: 'Sakura Haruno', value: 'Sakura' },
                    { name: 'Kakashi Hatake', value: 'Kakashi' }
                )),

    async execute(interaction) {
        const userId = interaction.user.id;
        const characterName = interaction.options.getString('character');

        // Check if user already chose a character
        const userCharacter = await Character.findOne({ where: { userId } });
        if (userCharacter) {
            return interaction.reply('❌ You have already chosen a character. Use `/profile` to view your stats.');
        }

        // Create the character entry for the user
        const abilities = {
            Naruto: 'Boosts XP gain by 20%',
            Sasuke: 'Increases rare item drop rates',
            Sakura: 'Reduces hunt cooldown by 30 minutes',
            Kakashi: 'Grants bonus coins for successful hunts'
        };

        await Character.create({
            userId,
            characterName,
            ability: abilities[characterName],
        });

        const embed = new MessageEmbed()
            .setTitle('🎉 Character Selected!')
            .setColor('#FFA500')
            .setDescription(`You have chosen **${characterName}**!\nYour ability: **${abilities[characterName]}**`)
            .setFooter('Prepare for your first hunt!');

        return interaction.reply({ embeds: [embed] });
    }
};