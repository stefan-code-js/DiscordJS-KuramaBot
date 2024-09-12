const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Moderations } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option => option.setName('target').setDescription('The user to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the warning')),

  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to warn members!', ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await Moderations.create({
        userId: target.id,
        moderatorId: interaction.user.id,
        action: 'warn',
        reason: reason,
        timestamp: new Date(),
      });

      await interaction.reply({ content: `${target.tag} has been warned. Reason: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to warn the user.', ephemeral: true });
    }
  }
};