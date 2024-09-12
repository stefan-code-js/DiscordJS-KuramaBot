const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js'); // Updated for v14+
const { Moderations } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban')),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'You do not have permission to ban members!', ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.ban(target.id, { reason });
      await Moderations.create({
        userId: target.id,
        moderatorId: interaction.user.id,
        action: 'ban',
        reason: reason,
        timestamp: new Date(),
      });

      await interaction.reply({ content: `${target.tag} has been banned. Reason: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to ban the user.', ephemeral: true });
    }
  }
};