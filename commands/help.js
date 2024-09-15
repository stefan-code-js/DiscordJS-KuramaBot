const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all the commands categorized.'),
    
    async execute(interaction) {
        // Read categories from JSON file
        const categories = JSON.parse(fs.readFileSync('./config/categories.json', 'utf8'));

        // Create the embed message
        const helpEmbed = new MessageEmbed()
            .setTitle('📜 Help - Command List')
            .setDescription('Here are all the commands categorized for easy navigation.')
            .setColor('#00FF00');

        // Add each category and its commands to the embed
        for (const category in categories) {
            const categoryData = categories[category];
            let commandList = '';
            
            categoryData.commands.forEach(command => {
                commandList += `**${command.name}**: ${command.description}\n`;
            });

            helpEmbed.addField(`${category} - ${categoryData.description}`, commandList);
        }

        await interaction.reply({ embeds: [helpEmbed] });
    }
};