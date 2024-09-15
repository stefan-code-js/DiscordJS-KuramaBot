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

    // Calculate the bonus reward based on streak
    let bonusReward = 0;
    let streakMessage = '';

    if (userProfile.streak >= 7) {
      const extraDays = userProfile.streak - 7;
      const increments = Math.floor(extraDays / 2); // Every 2 days after 7 adds 150 coins
      bonusReward = 200 + (increments * 150); // Start with 200 coins after 7 days, increase by 150 for every 2 extra days
      bonusReward = Math.min(bonusReward, 1200); // Cap the bonus at 1,200 coins
      streakMessage = `\nYou won a bonus of \`$${bonusReward}\` for claiming your daily for ${userProfile.streak} days in a row!`;
    }

    // Total reward
    const totalReward = reward + bonusReward;

    // Random XP between 10 and 50
    const randomXP = Math.floor(Math.random() * 41) + 10;

    // Update user's coins, streak, and XP
    userProfile.coins += totalReward;
    userProfile.xp += randomXP;
    userProfile.lastClaimed = now;

    await userProfile.save();

    // Format the message for an attractive UI
    const checkmarkEmoji = '✅';
    
    // Response formatted based on your requirements
    const responseMessage = `
${checkmarkEmoji} **You got \`$${totalReward}\` daily credits!**

Streak up! Current streak: \`${userProfile.streak}x\`${streakMessage}

**Coins Earned**: \`+${totalReward}\` (Base: \`$${reward}\`, Bonus: \`$${bonusReward}\`)
**XP Earned**: \`+${randomXP}\`

Keep your streak going for even bigger rewards!
    `;

    // Send the message
    await interaction.reply(responseMessage);
  }
};
