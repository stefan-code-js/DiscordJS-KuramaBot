const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Badge, Inventory } = require('../models');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View or set your profile details.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Display your profile.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your profile details.')
                .addStringOption(option => 
                    option.setName('description')
                        .setDescription('Set a profile description.'))
                .addStringOption(option => 
                    option.setName('birthday')
                        .setDescription('Set your birthday (e.g., 19-06).'))
                .addStringOption(option => 
                    option.setName('timezone')
                        .setDescription('Set your timezone (e.g., Europe/Berlin).'))
        ),

    async execute(interaction) {
        const userId = interaction.user.id;

        if (interaction.options.getSubcommand() === 'show') {
            const user = await User.findOne({ where: { userId } });
            if (!user) return interaction.reply('You don\'t have a profile yet! Start playing to generate one.');

            const badges = await Badge.findAll({ where: { userId } });
            const inventory = await Inventory.findAll({ where: { userId } });

            // Create an embed for the profile
            const profileEmbed = new MessageEmbed()
                .setTitle(`${interaction.user.username}'s Profile`)
                .setColor('#7289DA')
                .setDescription(user.description || 'No description set.')
                .addField('Level', `${user.level}`, true)
                .addField('XP', `${user.xp}`, true)
                .addField('Reputation', `${user.reputation}`, true)
                .addField('Credits', `${user.credits}`, true)
                .addField('Badges', badges.length ? badges.map(badge => badge.name).join(', ') : 'No badges yet.')
                .addField('Inventory', inventory.length ? inventory.map(item => `${item.itemName} x${item.quantity}`).join(', ') : 'No items yet.')
                .setFooter(`Your timezone: ${user.timezone || 'Not set'}`);

            return interaction.reply({ embeds: [profileEmbed] });
        }

        if (interaction.options.getSubcommand() === 'set') {
            const description = interaction.options.getString('description');
            const birthday = interaction.options.getString('birthday');
            const timezone = interaction.options.getString('timezone');

            const user = await User.findOne({ where: { userId } });
            if (!user) return interaction.reply('You don\'t have a profile yet! Start playing to generate one.');

            if (description) user.description = description;
            if (birthday) user.birthday = birthday;
            if (timezone) user.timezone = timezone;

            await user.save();
            return interaction.reply('✅ Your profile has been updated!');
        }
    }
};