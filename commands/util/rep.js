const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const { EmbedBuilder, Colors } = require('discord.js');
const cooldowns = new Map(); // Cooldowns to store user rep cooldowns
const moment = require('moment'); // Optional for better time formatting

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription('Give reputation to a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want to give reputation to')
        .setRequired(true)),

  async execute(interaction) {
    const userGivingRep = interaction.user.id;
    const targetUser = interaction.options.getUser('target');
    
    // Check if user is giving rep to themselves
    if (userGivingRep === targetUser.id) {
      return interaction.reply({ content: "❌ You can't give reputation to yourself!", ephemeral: true });
    }

    // Check cooldown
    const now = Date.now();
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const lastRepTime = cooldowns.get(userGivingRep);

    if (lastRepTime && now - lastRepTime < cooldownTime) {
      const remainingTime = cooldownTime - (now - lastRepTime);
      const hoursLeft = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutesLeft = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

      return interaction.reply({ content: `⏳ You need to wait **${hoursLeft} hours and ${minutesLeft} minutes** before giving reputation again!`, ephemeral: true });
    }

    try {
      // Fetch the target user's profile from the database
      let targetProfile = await Users.findOne({ where: { userId: targetUser.id } });

      if (!targetProfile) {
        // If the user profile doesn't exist, create one
        targetProfile = await Users.create({
          userId: targetUser.id,
          username: targetUser.username,
          reputation: 1 // Start with 1 rep since this is the first time they are receiving rep
        });
      } else {
        // Add 1 to their reputation
        targetProfile.reputation += 1;
      }

      // Save the updated target user's profile
      await targetProfile.save();

      // Set cooldown for the user
      cooldowns.set(userGivingRep, now);

      // Notify the user and the target about the reputation increase with emojis
      const embed = new EmbedBuilder()
        .setTitle('🌟 Reputation Given!')
        .setDescription(`**${interaction.user.tag}** has given 1 reputation point to **${targetUser.tag}**!`)
        .addFields({ 
          name: '🏅 New Reputation', 
          value: `**${targetUser.tag}** now has **${targetProfile.reputation}** reputation points!` 
        })
        .setColor(Colors.Gold)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Error giving reputation:', error);
      return interaction.reply({ content: '❌ An error occurred while giving reputation. Please try again later.', ephemeral: true });
    }
  },
};
