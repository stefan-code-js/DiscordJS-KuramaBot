module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;
  
      const command = client.commands.get(interaction.commandName);
      
      if (!command) {
        return interaction.reply({ content: 'Command not found!', ephemeral: true });
      }
  
      try {
        // If the command execution might take some time, use deferReply
        if (command.defer) {
          await interaction.deferReply(); // Only defer when it's necessary
        }
        
        // Execute the command
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
  
        // Ensure that only one response is sent
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    });
  };