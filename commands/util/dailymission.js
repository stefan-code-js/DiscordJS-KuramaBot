const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Mission } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailymission')
        .setDescription('Check your daily mission or start a new one.'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const now = new Date();
        const userMission = await Mission.findOne({ where: { userId, completed: false } });

        if (userMission) {
            const timeLeft = 24 * 60 * 60 * 1000 - (now - new Date(userMission.startTime).getTime());
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

            const missionEmbed = new MessageEmbed()
                .setTitle('🌟 Daily Mission')
                .setDescription(`Your daily mission is still ongoing! You have ${hoursLeft} hours and ${minutesLeft} minutes left to complete it.`)
                .setColor('#FFD700')
                .addField('Objective:', `${userMission.objective}`)
                .setFooter('Complete your daily mission for bonus rewards!');

            return interaction.reply({ embeds: [missionEmbed] });
        }

        const objectives = ['Hunt in the Forest of Death', 'Collect 5 Kunai', 'Find a Rare Jutsu Scroll'];
        const randomObjective = objectives[Math.floor(Math.random() * objectives.length)];

        await Mission.create({
            userId,
            objective: randomObjective,
            startTime: new Date(),
            completed: false,
        });

        const missionEmbed = new MessageEmbed()
            .setTitle('🌟 New Daily Mission')
            .setDescription('A new daily mission has been assigned to you!')
            .setColor('#FFD700')
            .addField('Objective:', `${randomObjective}`)
            .setFooter('Complete this mission today to earn bonus rewards.');

        return interaction.reply({ embeds: [missionEmbed] });
    }
};