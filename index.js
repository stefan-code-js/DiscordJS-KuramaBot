require('dotenv').config(); // Load environment variables
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { sequelize, Settings, Users, ReactionRoles } = require('./models');
const { token } = require('./config.json');
const setupInteractionHandler = require('./interactionHandler');

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect to the database:', err));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
});

// Collection for commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Loop through command folders and set commands to the collection
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command?.data?.name && typeof command.execute === 'function') {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] Command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  
  try {
    await sequelize.sync();
    console.log('Database synced successfully!');
  } catch (err) {
    console.error('Error syncing database:', err);
  }

  const prefixSetting = await Settings.findOne({ where: { key: 'prefix' } });
  client.prefix = prefixSetting ? prefixSetting.value : '!';
  console.log(`Bot prefix set to: ${client.prefix}`);
});

// Prefix-based message commands handling
client.on(Events.MessageCreate, async message => {
  if (message.author.bot || !message.content.startsWith(client.prefix)) return;
  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args); 
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    message.reply('There was an error executing that command.');
  }
});

// Slash commands interaction handler
setupInteractionHandler(client);

// Leveling system & profile creation
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  let userProfile = await Users.findOne({ where: { userId } });

  if (!userProfile) {
    userProfile = await Users.create({
      userId: message.author.id,
      username: message.author.username,
      badge: '',
      reputation: 0,
      credits: 0,
      legacyCredits: 0,
      birthday: null,
      badges: '',
      timezone: 'Unknown',
      level: 1,
      xp: 0
    });
  }

  const xpGain = Math.floor(Math.random() * 10) + 10;
  userProfile.xp += xpGain;

  const xpToNextLevel = userProfile.level * 100;
  if (userProfile.xp >= xpToNextLevel) {
    userProfile.level += 1;
    userProfile.xp = 0;

    const levelUpEmbed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('Level Up!')
      .setDescription(`${message.author.username}, you've reached **Level ${userProfile.level}!** 🎉`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'New Level', value: `**${userProfile.level}**`, inline: true },
        { name: 'Keep chatting to earn more XP!', value: 'Your XP has been reset to 0.', inline: true }
      )
      .setFooter({ text: `Earn more XP to reach the next level!` });

    message.channel.send({ embeds: [levelUpEmbed] });
  }

  await userProfile.save();
});

const userCooldowns = new Map();
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const now = Date.now();
  const cooldownAmount = 60 * 1000;

  if (userCooldowns.has(userId)) {
    const expirationTime = userCooldowns.get(userId) + cooldownAmount;
    if (now < expirationTime) return;
  }

  userCooldowns.set(userId, now);
});

// Reaction Role Management
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;

  const reactionRole = await ReactionRoles.findOne({
    where: { messageId: reaction.message.id, emoji: reaction.emoji.name }
  });
  if (!reactionRole) return;

  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.get(reactionRole.roleId);
  if (role && member) await member.roles.add(role);
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;

  const reactionRole = await ReactionRoles.findOne({
    where: { messageId: reaction.message.id, emoji: reaction.emoji.name }
  });
  if (!reactionRole) return;

  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.get(reactionRole.roleId);
  if (role && member) await member.roles.remove(role);
});

// Autorole command (assign up to 3 roles on member join)
client.on('guildMemberAdd', async (member) => {
  const roleIds = ['1282689982695473235', '1282688784458190899', '1282689295349448816']; // Example role IDs
  const rolesToAssign = roleIds
    .map(roleId => member.guild.roles.cache.get(roleId))
    .filter(role => role !== undefined);

  if (rolesToAssign.length > 0) {
    await member.roles.add(rolesToAssign);
    console.log(`Assigned roles to ${member.user.tag}.`);
  }
});

// Login the bot
client.login(token);