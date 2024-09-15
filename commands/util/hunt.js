const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { User, Hunt, Inventory } = require('../models');
const { getHuntRewards, getRandomEvent } = require('../utils/hunt');
const { calculateRank } = require('../utils/ranks');
const { emojis } = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hunt')
        .setDescription('Go on a Naruto-inspired hunt for quests, items, and XP!')
        .addStringOption(option => 
            option.setName('location')
                .setDescription('Choose a hunt location')
                .setRequired(false)
                .addChoices(
                    { name: 'Forest of Death', value: 'Forest of Death' },
                    { name: 'Valley of the End', value: 'Valley of the End' },
                    { name: 'Hidden Sand Village', value: 'Hidden Sand Village' }
                )),

    async execute(interaction) {
        const userId = interaction.user.id;
        const location = interaction.options.getString('location') || 'Default';
        const user = await User.findOne({ where: { userId } });

        // Dynamic random event or GIF
        const randomEvent = getRandomEvent();
        const gif = randomEvent ? randomEvent.gif : 'https://media.giphy.com/media/XZApSY6RxYOTW/giphy.gif'; // Placeholder GIF

        // Calculate rewards based on character, chakra, and more
        const { xp, coins, items } = getHuntRewards(location, user.characterName);

        // Display XP progress bar and embed
        const xpBar = generateXPProgressBar(user.xp, user.level);
        const huntEmbed = new MessageEmbed()
            .setTitle(`🦊 Hunting in ${location}!`)
            .setDescription(`${emojis.sword} **You have encountered a wild enemy!** Use your jutsu and skills wisely.`)
            .setColor('#FF4500')
            .setImage(gif)
            .addField('💰 Coins Earned', `${coins}`, true)
            .addField('⭐ XP Earned', `${xp}`, true)
            .addField('📊 XP Progress', xpBar, false)
            .addField('🗃️ Items Found', `${items.map(i => `${i.icon} **${i.name}** x${i.quantity}`).join(', ')}`, false)
            .setFooter('Hunt wisely to become stronger.');

        return interaction.reply({ embeds: [huntEmbed] });
    }
};