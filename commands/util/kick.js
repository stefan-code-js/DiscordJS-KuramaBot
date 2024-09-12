const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js'); // Updated for v14+
const { Moderations } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option => option.setName('target').setDescription('The user to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the kick')),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'You do not have permission to kick members!', ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: 'User not found!', ephemeral: true });
    }

    try {
      await member.kick(reason);
      await Moderations.create({
        userId: target.id,
        moderatorId: interaction.user.id,
        action: 'kick',
        reason: reason,
        timestamp: new Date(),
      });

      await interaction.reply({ content: `${target.tag} has been kicked. Reason: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to kick the user.', ephemeral: true });
    }
  }
};