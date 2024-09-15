const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildConfig } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setautorole')
        .setDescription('Set a role to be automatically assigned to new members.')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to assign automatically to new members.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const role = interaction.options.getRole('role');

        // Save the auto role ID in the database (GuildConfig model)
        await GuildConfig.upsert({
            guildId: interaction.guild.id,
            autoRoleId: role.id,
        });

        return interaction.reply(`✅ The role ${role.name} will now be automatically assigned to new members.`);
    }
};