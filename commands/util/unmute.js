const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js'); // Updated for v14+
const { Moderations } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption(option => option.setName('target').setDescription('The user to unmute').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: 'You do not have permission to unmute members!', ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: 'User not found!', ephemeral: true });
    }

    try {
      await member.timeout(null); // Removes the timeout (unmutes)
      await interaction.reply({ content: `${target.tag} has been unmuted.` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to unmute the user.', ephemeral: true });
    }
  }
};