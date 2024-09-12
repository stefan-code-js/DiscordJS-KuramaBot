const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js'); // Updated for v14+
const { Moderations } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Temporarily mute a user')
    .addUserOption(option => option.setName('target').setDescription('The user to mute').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration of the mute (e.g., 10m, 1h)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the mute')),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: 'You do not have permission to mute members!', ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const durationString = interaction.options.getString('duration');

    const durationMs = parseDuration(durationString);
    if (!durationMs) {
      return interaction.reply({ content: 'Invalid duration format! Use something like 10m, 1h, 1d.', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: 'User not found!', ephemeral: true });
    }

    try {
      await member.timeout(durationMs, reason); // Temporarily mute the user
      await Moderations.create({
        userId: target.id,
        moderatorId: interaction.user.id,
        action: 'mute',
        reason: reason,
        duration: durationMs,
        timestamp: new Date(),
      });

      await interaction.reply({ content: `${target.tag} has been muted for ${durationString}. Reason: ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to mute the user.', ephemeral: true });
    }
  }
};

// Helper function to convert duration string to milliseconds
function parseDuration(duration) {
  const durationRegex = /^(\d+)([smhd])$/;
  const match = duration.match(durationRegex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;           // Seconds
    case 'm': return value * 60 * 1000;      // Minutes
    case 'h': return value * 60 * 60 * 1000; // Hours
    case 'd': return value * 24 * 60 * 60 * 1000; // Days
    default: return null;
  }
}