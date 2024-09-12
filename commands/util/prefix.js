const { Settings } = require('../../models'); // Import the Settings model
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Get or set the bot\'s prefix')
    .addStringOption(option => 
      option.setName('newprefix')
        .setDescription('The new prefix to set for the bot')
        .setRequired(false)
    ),
  
  // Handles both slash and prefix-based commands
  async execute(interactionOrMessage, args = []) {
    const isSlashCommand = interactionOrMessage.isCommand?.();
    
    // Handle slash command interaction
    if (isSlashCommand) {
      const newPrefix = interactionOrMessage.options.getString('newprefix');
      await handlePrefixCommand(interactionOrMessage, newPrefix);
    } else {
      // Handle prefix-based command (from message)
      const newPrefix = args[0];
      await handlePrefixCommand(interactionOrMessage, newPrefix);
    }
  },
};

// Helper function to handle the actual logic for changing the prefix
async function handlePrefixCommand(interactionOrMessage, newPrefix) {
  const client = interactionOrMessage.client;

  if (newPrefix) {
    // Update the prefix in the database
    await client.db.Settings.update(
      { value: newPrefix },
      { where: { key: 'prefix' } }
    );

    const replyMessage = `Prefix updated to: ${newPrefix}`;
    
    if (interactionOrMessage.isCommand?.()) {
      await interactionOrMessage.reply(replyMessage);
    } else {
      interactionOrMessage.channel.send(replyMessage);
    }
  } else {
    // Retrieve the current prefix
    const currentPrefix = client.prefix || '!';
    const replyMessage = `Current bot prefix is: ${currentPrefix}`;

    if (interactionOrMessage.isCommand?.()) {
      await interactionOrMessage.reply(replyMessage);
    } else {
      interactionOrMessage.channel.send(replyMessage);
    }
  }
}