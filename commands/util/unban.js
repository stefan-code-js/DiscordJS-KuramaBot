const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js'); // Updated for v14+
const { Moderations } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addStringOption(option => option.setName('userid').setDescription('The user ID to unban').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'You do not have permission to unban members!', ephemeral: true });
    }

    const userId = interaction.options.getString('userid');

    try {
      await interaction.guild.members.unban(userId);
      await interaction.reply({ content: `User with ID ${userId} has been unbanned.` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to unban the user.', ephemeral: true });
    }
  }
};