const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models'); // Assuming you have a Users model for storing profile data
const moment = require('moment');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward with streaks'),

  async execute(interaction) {
    // Fetch or create the user's profile
    let userProfile = await Users.findOne({ where: { userId: interaction.user.id } });

    if (!userProfile) {
      userProfile = await Users.create({
        userId: interaction.user.id,
        username: interaction.user.username,
        coins: 0,
        streak: 0,
        lastClaimed: null,
        xp: 0,
      });
    }

    const now = moment();
    const lastClaimed = userProfile.lastClaimed ? moment(userProfile.lastClaimed) : null;

    // Check if they have already claimed today
    if (lastClaimed && now.diff(lastClaimed, 'days') === 0) {
      return interaction.reply({ content: '⚠️ **You have already claimed your daily reward today!**\nCome back tomorrow!', ephemeral: true });
    }

    // Base reward
    let reward = 300;

    // Increase streak if they claimed yesterday
    if (lastClaimed && now.diff(lastClaimed, 'days') === 1) {
      userProfile.streak += 1;
    } else {
      userProfile.streak = 1; // Reset streak if they missed a day
    }

    // Bonus reward if streak >= 7 days
    if (userProfile.streak >= 7) {
      reward += 200; // Add 200 coins after one week of streak
    }

    // Random XP between 10 and 50
    const randomXP = Math.floor(Math.random() * 41) + 10;

    // Update user's coins, streak, and XP
    userProfile.coins += reward;
    userProfile.xp += randomXP;
    userProfile.lastClaimed = now;

    await userProfile.save();

    // Format the message for an attractive UI
    const streakEmoji = '🔥';
    const coinEmoji = '💰';
    const xpEmoji = '✨';
    const checkmarkEmoji = '✅';
    
    const responseMessage = `
${checkmarkEmoji} **Daily Reward Claimed!**
━━━━━━━━━━━━━━━━━━━━━━━━
${coinEmoji} **Coins Earned**: \`+${reward}\`
${xpEmoji} **XP Earned**: \`+${randomXP}\`
${streakEmoji} **Streak**: \`${userProfile.streak} days\`
━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Keep the streak going for bigger rewards!
`;

    // Send the attractive UI message
    await interaction.reply(responseMessage);
  }
};