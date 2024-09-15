const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildConfig } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Set the welcome message channel.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel where the welcome message will be sent.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        // Save the welcome channel ID in the database (GuildConfig model)
        await GuildConfig.upsert({
            guildId: interaction.guild.id,
            welcomeChannelId: channel.id,
        });

        return interaction.reply(`✅ Welcome messages will be sent to ${channel.name}`);
    }
};