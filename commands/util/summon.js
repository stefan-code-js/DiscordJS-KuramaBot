const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Summon } = require('../models');
const { getSummonOutcome, summonEvolution } = require('../utils/summon');
const { emojis } = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('summon')
        .setDescription('Summon a creature to assist you in your hunt or battle.')
        .addStringOption(option => 
            option.setName('creature')
                .setDescription('Summon a creature')
                .setRequired(true)
                .addChoices(
                    { name: 'Gamabunta (Toad)', value: 'Gamabunta' },
                    { name: 'Manda (Snake)', value: 'Manda' },
                    { name: 'Katsuyu (Slug)', value: 'Katsuyu' }
                )),

    async execute(interaction) {
        const userId = interaction.user.id;
        const creature = interaction.options.getString('creature');
        const summon = await Summon.findOne({ where: { userId, creatureName: creature } });

        // Check summon evolution based on user level
        const evolvedCreature = summonEvolution(summon, interaction.user.level);

        // Get the outcome of the summon
        const { success, xp, coins } = getSummonOutcome(evolvedCreature);

        const summonEmbed = new MessageEmbed()
            .setTitle('🔮 Creature Summoned!')
            .setColor(success ? '#00FF00' : '#FF0000')
            .setDescription(success 
                ? `🎉 **${evolvedCreature}** successfully assists you, earning you **${xp} XP** and **${coins} coins!**` 
                : `❌ **${creature}** failed to summon correctly. No reward this time.`)
            .setFooter('Your creature evolves as you grow stronger.');

        return interaction.reply({ embeds: [summonEmbed] });
    }
};