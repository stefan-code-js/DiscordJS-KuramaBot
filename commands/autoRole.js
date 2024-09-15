const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildConfig } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setautorole')
        .setDescription('Set up to 3 roles to be automatically assigned to new members.')
        .addRoleOption(option => 
            option.setName('role1')
                .setDescription('First role to assign automatically.')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role2')
                .setDescription('Second role to assign automatically.')
                .setRequired(false))
        .addRoleOption(option => 
            option.setName('role3')
                .setDescription('Third role to assign automatically.')
                .setRequired(false)),

    async execute(interaction) {
        const role1 = interaction.options.getRole('role1');
        const role2 = interaction.options.getRole('role2');
        const role3 = interaction.options.getRole('role3');

        // Save the auto role IDs in the database (GuildConfig model)
        await GuildConfig.upsert({
            guildId: interaction.guild.id,
            autoRoleId1: role1.id,
            autoRoleId2: role2 ? role2.id : null,
            autoRoleId3: role3 ? role3.id : null,
        });

        return interaction.reply(`✅ The following roles will now be automatically assigned to new members:\n${role1}\n${role2 || ''}\n${role3 || ''}`);
    }
};