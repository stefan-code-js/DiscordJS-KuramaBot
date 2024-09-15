const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, KekkeiGenkai } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choosekekkeigenkai')
        .setDescription('Choose your bloodline limit ability.')
        .addStringOption(option => 
            option.setName('kekkeigenkai')
                .setDescription('Select your Kekkei Genkai')
                .setRequired(true)
                .addChoices(
                    { name: 'Sharingan', value: 'Sharingan' },
                    { name: 'Byakugan', value: 'Byakugan' },
                    { name: 'Ice Release', value: 'Ice Release' }
                )),

    async execute(interaction) {
        const userId = interaction.user.id;
        const chosenKekkeiGenkai = interaction.options.getString('kekkeigenkai');

        // Check if user has already chosen a Kekkei Genkai
        const existingKekkeiGenkai = await KekkeiGenkai.findOne({ where: { userId } });
        if (existingKekkeiGenkai) {
            return interaction.reply('❌ You have already chosen a Kekkei Genkai. Use `/profile` to view your stats.');
        }

        const abilities = {
            Sharingan: 'Gain extra critical hit chance in battles.',
            Byakugan: 'See through enemy illusions and traps, increasing success rate in hunts.',
            IceRelease: 'Deal additional elemental damage during hunts and battles.'
        };

        // Assign the Kekkei Genkai to the user
        await KekkeiGenkai.create({
            userId,
            kekkeiGenkai: chosenKekkeiGenkai,
            ability: abilities[chosenKekkeiGenkai]
        });

        const embed = new MessageEmbed()
            .setTitle('🎴 Kekkei Genkai Chosen!')
            .setColor('#DC143C')
            .setDescription(`You have chosen **${chosenKekkeiGenkai}**!\nYour bloodline ability: **${abilities[chosenKekkeiGenkai]}**`)
            .setFooter('Your Kekkei Genkai will now affect your hunts and battles.');

        return interaction.reply({ embeds: [embed] });
    }
};