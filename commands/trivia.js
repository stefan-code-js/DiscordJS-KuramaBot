const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require('../models');

// Sample trivia questions
const triviaQuestions = [
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Answer a trivia question to win credits!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Select a random trivia question
        const trivia = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

        // Ask the question and wait for the user's answer
        await interaction.reply(`🤔 Trivia Time! ${trivia.question}\nType your answer within 30 seconds.`);

        const filter = response => response.user.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ['time']
        }).catch(() => null);

        if (!collected || !collected.first()) {
            return interaction.followUp('⏰ Time\'s up! You didn\'t answer in time.');
        }

        const userAnswer = collected.first().content.toLowerCase();
        if (userAnswer === trivia.answer.toLowerCase()) {
            // Fetch user and reward them
            const user = await User.findOne({ where: { userId } });
            const reward = 100; // Fixed reward for correct answer
            user.credits += reward;
            await user.save();

            return interaction.followUp(`🎉 Correct! You earned ${reward} credits.`);
        } else {
            return interaction.followUp(`❌ Incorrect! The correct answer was: **${trivia.answer}**.`);
        }
    }
};