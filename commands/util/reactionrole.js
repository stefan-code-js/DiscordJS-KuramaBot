const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js'); 
const { ReactionRoles } = require('../../models');
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Set up a reaction role with a custom label')
    .addStringOption(option => option.setName('label').setDescription('Custom text label for the reaction role').setRequired(true))
    .addStringOption(option => option.setName('emoji').setDescription('The emoji for the reaction').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role to assign on reaction').setRequired(true)),

  async execute(interaction) {
    // Check if the user has permission to manage roles
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: 'You do not have permission to manage roles!', ephemeral: true });
    }

    const label = interaction.options.getString('label'); // Custom text
    const emoji = interaction.options.getString('emoji');
    const role = interaction.options.getRole('role');

    // Check if the bot has permission to manage roles and the role is below the bot's role in the hierarchy
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      console.error('Bot does not have permission to manage roles.');
      return interaction.reply({ content: 'I do not have permission to manage roles!', ephemeral: true });
    }
    
    // Check if the bot's role is high enough
    if (interaction.guild.members.me.roles.highest.position <= role.position) {
      console.error('Bot role is not high enough to assign the specified role.');
      return interaction.reply({ content: 'My role is not high enough to assign this role. Please move my role higher than the role you want me to assign.', ephemeral: true });
    }

    try {
      // Save the reaction role to the database
      await ReactionRoles.create({
        text: label,
        emoji: emoji,
        roleId: role.id,
      });

      // Send a message with role details and react to it
      const roleEmbed = new EmbedBuilder()
        .setColor(role.hexColor) // Display the role color
        .setTitle('Reaction Role Set')
        .setDescription(`React with ${emoji} to get the **${role.name}** role!`)
        .addFields(
          { name: 'Label', value: `**${label}**`, inline: true },
          { name: 'Role Name', value: `**${role.name}**`, inline: true },
          { name: 'Role Color', value: `${role.hexColor}`, inline: true }
        );

      const message = await interaction.reply({ embeds: [roleEmbed], fetchReply: true });

      // React to the message with the provided emoji
      await message.react(emoji);

      // Set up reaction role logic (both add and remove roles)
      const filter = (reaction, user) => !user.bot && reaction.emoji.name === emoji;
      const collector = message.createReactionCollector({ filter, dispose: true });

      // Add role on reaction
      collector.on('collect', async (reaction, user) => {
        const member = interaction.guild.members.cache.get(user.id);
        console.log(`User ${user.tag} reacted with ${emoji}. Attempting to add role: ${role.name}`);
        
        if (!member) {
          console.error(`Member ${user.tag} not found in the guild.`);
          return;
        }

        if (!member.roles.cache.has(role.id)) {
          try {
            await member.roles.add(role);
            console.log(`Successfully added role ${role.name} to ${member.user.tag}`);
            await user.send(`You have been given the **${role.name}** role!`);
          } catch (error) {
            console.error(`Failed to add role to ${member.user.tag}: ${error.message}`);
          }
        } else {
          console.log(`${member.user.tag} already has the ${role.name} role.`);
        }
      });

      // Remove role on unreaction
      collector.on('remove', async (reaction, user) => {
        const member = interaction.guild.members.cache.get(user.id);
        console.log(`User ${user.tag} removed reaction ${emoji}. Attempting to remove role: ${role.name}`);
        
        if (!member) {
          console.error(`Member ${user.tag} not found in the guild.`);
          return;
        }

        if (member.roles.cache.has(role.id)) {
          try {
            await member.roles.remove(role);
            console.log(`Successfully removed role ${role.name} from ${member.user.tag}`);
            await user.send(`The **${role.name}** role has been removed from you.`);
          } catch (error) {
            console.error(`Failed to remove role from ${member.user.tag}: ${error.message}`);
          }
        } else {
          console.log(`${member.user.tag} does not have the ${role.name} role.`);
        }
      });

    } catch (error) {
      console.error(`Error during reaction role setup: ${error.message}`);
      await interaction.reply({ content: 'There was an error setting up the reaction role.', ephemeral: true });
    }
  }
};