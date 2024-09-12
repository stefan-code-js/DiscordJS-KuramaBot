const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Users } = require('../../models');
const { getIcons } = require('../util/icons');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Display or update your profile')
    .addSubcommand(subcommand => subcommand
      .setName('view')
      .setDescription('View your profile'))
    .addSubcommand(subcommand => subcommand
      .setName('set')
      .setDescription('Set profile details')
      .addStringOption(option => option.setName('description').setDescription('Set your profile description'))
      .addStringOption(option => option.setName('birthday').setDescription('Set your birthday (YYYY-MM-DD)'))
      .addStringOption(option => option.setName('timezone').setDescription('Set your timezone'))),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      
      await interaction.deferReply({ ephemeral: true });

      if (subcommand === 'view') {
        let userProfile = await Users.findOne({ where: { userId: interaction.user.id } });

        if (!userProfile) {
          userProfile = await Users.create({
            userId: interaction.user.id,
            username: interaction.user.username,
            level: 1,  // Ensure level is initialized properly
            xp: 0,     // Ensure XP is initialized properly
            // other fields...
          });
        }

        const xpToNextLevel = userProfile.level * 100; // XP needed to level up
        let levelUpMessage = null;

        if (userProfile.xp >= xpToNextLevel) {
          userProfile.level += 1; // Level up
          userProfile.xp -= xpToNextLevel; // Reset XP
          await userProfile.save();
          levelUpMessage = `🎉 **Congratulations!** You've leveled up to **Level ${userProfile.level}**!`;
        }

        const icons = getIcons();
        const xpProgress = `${userProfile.xp}/${xpToNextLevel}`;
        const botUser = interaction.client.user;
        const botOwner = await interaction.guild.fetchOwner();

        const profileEmbed = new EmbedBuilder()
          .setColor(0x00AE86)
          .setTitle(`${userProfile.username}'s Profile`)
          .setDescription(userProfile.description || 'No description set. You can set one with /profile set description')
          .addFields(
            { name: `${icons.trophy} Display Badge`, value: userProfile.badge || 'No badge set' },
            { name: `${icons.heart} Married with`, value: 'Nobody', inline: true },
            { name: `${icons.medal} Reputation`, value: `${userProfile.reputation || 0}`, inline: true },
            { name: `${icons.money} Credits`, value: `$${userProfile.credits.toLocaleString()}`, inline: true },
            { name: `${icons.legacyMoney} Legacy Credits`, value: `$${userProfile.legacyCredits.toLocaleString()}`, inline: true },
            { name: `${icons.badge} Badge Collection (Top 5)`, value: 'No badges earned yet' },
            { name: `${icons.cake} Birthday`, value: userProfile.birthday || 'Not set', inline: true },
            { name: `${icons.star} Level`, value: `Level ${userProfile.level ?? 1} (${xpProgress} XP)`, inline: true },
            { name: 'Timezone', value: userProfile.timezone || 'Unknown', inline: true }
          )
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `${botUser.username} | Bot Owner: ${botOwner.user.tag}`,
            iconURL: botUser.displayAvatarURL(),
          });

        if (levelUpMessage) {
          profileEmbed.addFields({ name: '🎉 Level Up!', value: levelUpMessage });
        }

        await interaction.editReply({ embeds: [profileEmbed] });
      } 
    } catch (error) {
      console.error(`Error executing command profile: ${error}`);
      await interaction.editReply({ content: 'An error occurred while executing your profile command.' });
    }
  },
};

