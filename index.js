require('dotenv').config(); // Load environment variables
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { sequelize, Settings } = require('./models');
const { token } = require('./config.json');
const setupInteractionHandler = require('./interactionHandler');
const { Users } = require('./models');
sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect to the database:', err));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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

    // Ensure command has `data` and `execute` properties
    if (command?.data?.name && typeof command.execute === 'function') {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] Command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  
  // Sync the database models
  try {
    await sequelize.sync();
    console.log('Database synced successfully!');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
  
  // Fetch or set the default prefix
  const prefixSetting = await Settings.findOne({ where: { key: 'prefix' } });
  client.prefix = prefixSetting ? prefixSetting.value : '!';
  console.log(`Bot prefix set to: ${client.prefix}`);
});

// Listen for message events to handle prefix-based commands
client.on(Events.MessageCreate, async message => {
  // Ignore bot messages and non-prefix messages
  if (message.author.bot || !message.content.startsWith(client.prefix)) return;

  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args); // Call command with message and args for prefix-based commands
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    message.reply('There was an error executing that command.');
  }
});

// Setup the interaction handler (for slash commands)
setupInteractionHandler(client);

const { EmbedBuilder } = require('discord.js');
client.on(Events.MessageCreate, async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  const userId = message.author.id;
  let userProfile = await Users.findOne({ where: { userId } });

  // If user does not have a profile, create a new one
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
      level: 1, // Default level
      xp: 0     // Default XP
    });
  }

  // Add XP to the user
  const xpGain = Math.floor(Math.random() * 10) + 10; // Gain between 10 and 20 XP per message
  userProfile.xp += xpGain;

  // Calculate if the user has leveled up
  const xpToNextLevel = userProfile.level * 100;
  if (userProfile.xp >= xpToNextLevel) {
    userProfile.level += 1;
    userProfile.xp = 0; // Reset XP after level up

    // Create the embed for leveling up
    const levelUpEmbed = new EmbedBuilder()
      .setColor(0xFFD700) // Gold color for leveling up
      .setTitle('Level Up!')
      .setDescription(`${message.author.username}, you've reached **Level ${userProfile.level}!** 🎉`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'New Level', value: `**${userProfile.level}**`, inline: true },
        { name: 'Keep chatting to earn more XP!', value: 'Your XP has been reset to 0.', inline: true }
      )
      .setFooter({ text: `Earn more XP to reach the next level!` });

    // Send the level-up embed message
    message.channel.send({ embeds: [levelUpEmbed] });
  }

  // Save the updated profile
  await userProfile.save();
});

const userCooldowns = new Map();

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  // Check if the user is on cooldown
  const now = Date.now();
  const cooldownAmount = 60 * 1000; // 1 minute cooldown

  if (userCooldowns.has(userId)) {
    const expirationTime = userCooldowns.get(userId) + cooldownAmount;

    if (now < expirationTime) {
      // If the user is still on cooldown, don't add XP
      return;
    }
  }

  // Set or reset the user's cooldown
  userCooldowns.set(userId, now);

  // Rest of the leveling logic...
});

const { ReactionRoles } = require('./models');

client.on('messageReactionAdd', async (reaction, user) => {
  // Fetch partial data (needed for reactions to old messages)
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return; // Ignore bot reactions

  // Get the associated role from the database
  const reactionRole = await ReactionRoles.findOne({
    where: {
      messageId: reaction.message.id,
      emoji: reaction.emoji.name
    }
  });

  if (!reactionRole) return; // No reaction role set for this reaction

  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.get(reactionRole.roleId);

  if (role && member) {
    await member.roles.add(role);
    console.log(`Added role ${role.name} to ${user.tag}`);
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  // Fetch partial data (needed for reactions to old messages)
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return; // Ignore bot reactions

  // Get the associated role from the database
  const reactionRole = await ReactionRoles.findOne({
    where: {
      messageId: reaction.message.id,
      emoji: reaction.emoji.name
    }
  });

  if (!reactionRole) return; // No reaction role set for this reaction

  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.get(reactionRole.roleId);

  if (role && member) {
    await member.roles.remove(role);
    console.log(`Removed role ${role.name} from ${user.tag}`);
  }
});

//Autorole command
client.on('guildMemberAdd', async (member) => {
  const roleIds = ['1282689982695473235', '1282688784458190899', '1282689295349448816', '1219367394464763944']; // Array of role IDs

  const rolesToAssign = roleIds
    .map(roleId => member.guild.roles.cache.get(roleId))
    .filter(role => role !== undefined); // Ensure all roles exist in the guild

  if (rolesToAssign.length === 0) {
    console.error('No valid roles found.');
    return;
  }

  try {
    await member.roles.add(rolesToAssign);
    console.log(`Roles [${rolesToAssign.map(role => role.name).join(', ')}] assigned to ${member.user.tag}.`);
  } catch (error) {
    console.error(`Failed to assign roles to ${member.user.tag}:`, error);
  }
});

// Login the bot
client.login(token);