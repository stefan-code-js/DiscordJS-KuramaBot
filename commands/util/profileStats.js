const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Users } = require('../../models'); // Assuming you have a Users model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile-stats')
    .setDescription('Show your profile statistics'),

  async execute(interaction) {
    const userId = interaction.user.id;
    
    // Fetch the user's profile from the database
    let userProfile = await Users.findOne({ where: { userId } });
    
    if (!userProfile) {
      return interaction.reply({ content: 'You need to create a profile first.', ephemeral: true });
    }

    // Parse the user's inventory (if needed for equipment)
    let inventory = JSON.parse(userProfile.inventory || '{}');
    let pickaxe = inventory.pickaxe ? `Pickaxe: ${inventory.pickaxe.name} [${inventory.pickaxe.durability}/${inventory.pickaxe.maxDurability}]` : 'Not equipped';
    let rod = inventory.rod ? `Rod: ${inventory.rod.name} [${inventory.rod.durability}/${inventory.rod.maxDurability}]` : 'Not equipped';

    // Build the profile embed
    const profileEmbed = new EmbedBuilder()
      .setTitle(`Profile Statistics for ${interaction.user.username}`)
      .setDescription('Here are your profile stats.')
      .addFields(
        { name: 'Market Used', value: `${userProfile.marketUsed || 0} times`, inline: true },
        { name: 'Active Potion', value: userProfile.activePotion || 'None', inline: true },
        { name: 'Equipment', value: `${pickaxe}\n${rod}`, inline: false },
        { name: 'Experience', value: `${userProfile.xp}/${userProfile.xpNeeded} XP`, inline: false },
        { name: 'Daily Streak', value: `${userProfile.streak || 0} day(s)`, inline: true },
        { name: 'Last Daily', value: `${userProfile.lastClaimed || 'N/A'}`, inline: true },
        { name: 'Casino Wins', value: `Gamble: ${userProfile.gambleWins || 0}, Slots: ${userProfile.slotWins || 0}`, inline: false }
      )
      .setColor(0x3498db)
      .setThumbnail(interaction.user.displayAvatarURL());

    // Send the profile embed
    return interaction.reply({ embeds: [profileEmbed] });
  },
};
