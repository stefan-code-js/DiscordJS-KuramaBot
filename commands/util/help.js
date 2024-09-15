const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Using EmbedBuilder for cleaner UI
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands or information about a specific command.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The name of the command to get details about')
        .setRequired(false)),

  async execute(interaction) {
    const commandName = interaction.options.getString('command');

    if (commandName) {
      // If a specific command is provided, give detailed information
      const command = interaction.client.commands.get(commandName);

      if (!command) {
        return interaction.reply({ content: `❌ Command \`${commandName}\` not found.`, ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle(`Help: ${command.data.name}`)
        .setDescription(command.data.description || 'No description provided.')
        .addFields({ name: 'Usage', value: `/${command.data.name}` })
        .setColor('Blue');

      return interaction.reply({ embeds: [embed], ephemeral: true });

    } else {
      // Show all available commands in the server
      const commandFiles = fs.readdirSync(path.join(__dirname, '../')).filter(file => file.endsWith('.js'));

      const embed = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription('Here is a list of all available commands.')
        .setColor('Blue');

      commandFiles.forEach(file => {
        const command = require(`../${file}`);
        embed.addFields({ name: `/${command.data.name}`, value: command.data.description || 'No description available.' });
      });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
