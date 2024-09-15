const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const triviaQuestions = require('../util/triviaQuestions'); // Trivia questions from a JSON file
const cooldowns = new Map();
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer random trivia questions to earn rewards')
    .addStringOption(option =>
      option.setName('difficulty')
        .setDescription('Select trivia difficulty: easy, medium, or hard')
        .setRequired(true)
        .addChoices(
          { name: 'Easy', value: 'easy' },
          { name: 'Medium', value: 'medium' },
          { name: 'Hard', value: 'hard' }
      )),

  async execute(interaction) {
    const userId = interaction.user.id;
    const now = moment();

    // Cooldown logic (1 minute per trivia)
    const cooldownTime = 60 * 1000; // 1 minute
    const lastTriviaTime = cooldowns.get(userId);

    if (lastTriviaTime && now - lastTriviaTime < cooldownTime) {
      return interaction.reply({ content: '⏳ Please wait a minute before attempting another trivia question.', ephemeral: true });
    }

    // Update cooldown
    cooldowns.set(userId, now);

    // Fetch or create user profile
    let userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      userProfile = await Users.create({
        userId,
        username: interaction.user.username,
        xp: 0,
        coins: 0,
      });
    }

    // Get the selected difficulty
    const difficulty = interaction.options.getString('difficulty');

    // Filter trivia questions by selected difficulty
    const filteredQuestions = triviaQuestions.filter(q => q.difficulty === difficulty);
    const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
    const options = randomQuestion.options.map((opt, index) => `${String.fromCharCode(65 + index)}. ${opt}`).join('\n');

    const triviaMessage = `
      **${difficulty.toUpperCase()} Trivia Question:**
      ${randomQuestion.question}
      ${options}
    `;

    await interaction.reply({ content: triviaMessage, ephemeral: true });

    // Listen for user's answer
    const filter = response => response.author.id === userId;
    const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000 });

    if (collected.size === 0) {
      return interaction.followUp({ content: '⏰ Time\'s up! No answer received.', ephemeral: true });
    }

    const userAnswer = collected.first().content.toUpperCase();
    const correctAnswer = randomQuestion.correctAnswer;

    // Define rewards based on difficulty
    let rewardCoins = 0;
    if (difficulty === 'easy') rewardCoins = 40;
    else if (difficulty === 'medium') rewardCoins = 60;
    else if (difficulty === 'hard') rewardCoins = 80;

    // Evaluate the answer
    if (userAnswer === correctAnswer) {
      userProfile.coins += rewardCoins; // Add coins for correct answers
      userProfile.xp += 50; // Add XP for correct answers
      await userProfile.save();

      return interaction.followUp({ content: `✅ Correct! You've earned ${rewardCoins} coins and 50 XP.`, ephemeral: true });
    } else {
      return interaction.followUp({ content: `❌ Incorrect. The correct answer was ${correctAnswer}. Better luck next time!`, ephemeral: true });
    }
  }
};
