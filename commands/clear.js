const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from a channel.')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to clear').setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        
        if (amount < 1 || amount > 100) {
            return interaction.reply('❌ You need to input a number between 1 and 100.');
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply(`✅ Successfully deleted ${amount} messages.`);
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ There was an error trying to clear messages in this channel.');
        }
    }
};