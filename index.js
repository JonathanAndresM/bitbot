require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  PermissionsBitField,
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ─── Función de verificación ──────────────────────────────
async function verificarUsuario(member) {
  const dbPath = process.env.USUARIOS_DATA_PATH;
  if (!dbPath) return console.error('❌ Falta RUTA_DB_USUARIOS en el .env');

  let data;
  try {
    const raw = fs.readFileSync(path.resolve(dbPath), 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    console.error('❌ Error al leer la base de datos de usuarios:', e);
    return;
  }

  if (!data || !Array.isArray(data.usuarios)) {
    console.error('❌ El archivo usuarios.json no tiene el formato correcto.');
    return;
  }

  const usuario = data.usuarios.find(
    u => u.username.toLowerCase() === member.user.username.toLowerCase()
  );

  if (!usuario) {
    try {
      await member.send('🚫 No estás registrado aún. Por favor registrate en la plataforma.');
    } catch {}
    return;
  }

  const canal = member.guild.channels.cache.find(c => c.name === usuario.grupo);
  if (!canal) return console.warn(`⚠️ Canal "${usuario.grupo}" no encontrado.`);

  try {
    await canal.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    await member.send(`✅ Acceso otorgado al canal **#${canal.name}** según tu grupo.`);
  } catch (err) {
    console.error('❌ Error al asignar permisos:', err);
  }
}

// ─── Bienvenida al entrar ──────────────────────────────
client.on('guildMemberAdd', async member => {
  const welcomeChannel = member.guild.channels.cache.get(process.env.CANAL_BIENVENIDA_ID);

if (welcomeChannel) {
    welcomeChannel.send(`¡Bienvenido ${member.user.username} al servidor! 🎉\nUsa \`/ayuda\` para comenzar.`);
  }

  try {
    await member.send('¡Bienvenido! Escribí `/ayuda` para guiarte en el registro.');
  } catch {}

  await verificarUsuario(member);
});

// ─── Comandos Slash ──────────────────────────────
const commands = [
  {
    name: 'ayuda',
    description: 'Muestra la ayuda para el registro',
  },
  {
    name: 'perfil',
    description: 'Muestra tu perfil básico',
  },
  {
    name: 'reglas',
    description: 'Muestra las reglas del servidor',
  },
  {
    name: 'info',
    description: 'Muestra información del servidor',
  },
  {
    name: 'ping',
    description: 'Muestra la latencia del bot',
  },
  {
    name: 'verificar',
    description: 'Verifica tu usuario o el de otro miembro (admins)',
    options: [
      {
        name: 'usuario',
        description: 'El usuario a verificar',
        type: 6, // USER
        required: false,
      },
    ],
  },
  {
    name: 'ban',
    description: 'Banea a un usuario',
    options: [
      { name: 'usuario', type: 6, description: 'Usuario a banear', required: true },
      { name: 'razon', type: 3, description: 'Razón del baneo', required: false },
    ],
  },
  {
    name: 'kick',
    description: 'Expulsa a un usuario',
    options: [
      { name: 'usuario', type: 6, description: 'Usuario a expulsar', required: true },
      { name: 'razon', type: 3, description: 'Razón de la expulsión', required: false },
    ],
  },
  {
    name: 'mute',
    description: 'Silencia a un usuario',
    options: [
      { name: 'usuario', type: 6, description: 'Usuario a silenciar', required: true },
      { name: 'razon', type: 3, description: 'Razón del muteo', required: false },
    ],
  },
  {
    name: 'unmute',
    description: 'Des-silencia a un usuario',
    options: [
      { name: 'usuario', type: 6, description: 'Usuario a desmutear', required: true },
    ],
  },
  {
    name: 'warn',
    description: 'Advierte a un usuario',
    options: [
      { name: 'usuario', type: 6, description: 'Usuario a advertir', required: true },
      { name: 'razon', type: 3, description: 'Razón de la advertencia', required: false },
    ],
  },
];

// ─── Registro de comandos ──────────────────────────────
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID),
      { body: commands }
    );
    console.log('🔄 Comandos de barra registrados');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();

// ─── Interacciones Slash ──────────────────────────────
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user, guild } = interaction;

  switch (commandName) {
    case 'ayuda':
      await interaction.reply({
        content: '**📌 Pasos para registrarte:**\n1. Verificá tu email\n2. Completá tu perfil con `/perfil`\n3. ¡Listo!',
        ephemeral: true,
      });
      break;

    case 'perfil':
      await interaction.reply({
        content: `👤 **Perfil de ${user.username}**\n📅 Cuenta creada: <t:${Math.floor(user.createdTimestamp / 1000)}:D>\n🆔 ID: ${user.id}`,
        ephemeral: true,
      });
      break;

    case 'reglas':
      await interaction.reply({
        content: '**📜 Reglas del servidor:**\n1. Respeto mutuo\n2. No spam\n3. Seguir a los mods\n4. ¡Divertite! 🎉',
        ephemeral: true,
      });
      break;

    case 'info':
      await interaction.reply({
        content: `📊 **Info del servidor:**\n🔤 Nombre: ${guild.name}\n👥 Miembros: ${guild.memberCount}\n🆔 ID: ${guild.id}`,
        ephemeral: true,
      });
      break;

    case 'ping':
      await interaction.reply({
        content: `🏓 ¡Pong! Latencia: **${Date.now() - interaction.createdTimestamp}ms**`,
        ephemeral: true,
      });
      break;

    case 'verificar': {
      const objetivo = interaction.options.getUser('usuario') || interaction.user;
      const miembro = interaction.guild.members.cache.get(objetivo.id);

      if (objetivo.id !== interaction.user.id && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: '🚫 No tenés permisos para verificar a otros usuarios.', ephemeral: true });
      }

      await verificarUsuario(miembro);
      await interaction.reply({ content: `🔍 Verificando a ${objetivo.username}...`, ephemeral: true });
      break;
    }

    case 'ban': {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: '🚫 No tenés permiso para banear.', ephemeral: true });
      }
      const usuario = interaction.options.getUser('usuario');
      const razon = interaction.options.getString('razon') || 'Sin razón';
      const miembro = interaction.guild.members.cache.get(usuario.id);
      if (!miembro) return interaction.reply({ content: '❌ Usuario no encontrado.', ephemeral: true });

      await miembro.ban({ reason: razon });
      await interaction.reply(`🔨 ${usuario.tag} fue baneado. Razón: ${razon}`);
      break;
    }

    case 'kick': {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: '🚫 No tenés permiso para expulsar.', ephemeral: true });
      }
      const usuario = interaction.options.getUser('usuario');
      const razon = interaction.options.getString('razon') || 'Sin razón';
      const miembro = interaction.guild.members.cache.get(usuario.id);
      if (!miembro) return interaction.reply({ content: '❌ Usuario no encontrado.', ephemeral: true });

      await miembro.kick(razon);
      await interaction.reply(`👢 ${usuario.tag} fue expulsado. Razón: ${razon}`);
      break;
    }

    case 'mute': {
      const usuario = interaction.options.getUser('usuario');
      const razon = interaction.options.getString('razon') || 'Sin razón';
      const miembro = interaction.guild.members.cache.get(usuario.id);
      const mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
      if (!mutedRole || !miembro) return interaction.reply({ content: '❌ Rol o usuario no encontrado.', ephemeral: true });

      await miembro.roles.add(mutedRole);
      await interaction.reply(`🔇 ${usuario.tag} fue silenciado. Razón: ${razon}`);
      break;
    }

    case 'unmute': {
      const usuario = interaction.options.getUser('usuario');
      const miembro = interaction.guild.members.cache.get(usuario.id);
      const mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
      if (!mutedRole || !miembro) return interaction.reply({ content: '❌ Rol o usuario no encontrado.', ephemeral: true });

      await miembro.roles.remove(mutedRole);
      await interaction.reply(`🔊 ${usuario.tag} ya no está silenciado.`);
      break;
    }

    case 'warn': {
      const usuario = interaction.options.getUser('usuario');
      const razon = interaction.options.getString('razon') || 'Sin razón';
      await interaction.reply(`⚠️ ${usuario.tag} fue advertido. Razón: ${razon}`);
      try {
        await usuario.send(`⚠️ Recibiste una advertencia en ${interaction.guild.name}: ${razon}`);
      } catch {}
      break;
    }
  }
});

// ─── Mención directa al bot ──────────────────────────────
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.mentions.has(client.user)) {
    message.reply({
      content: '¡Hola! 👋 Usá `/ayuda` para ver los pasos de registro.',
      allowedMentions: { repliedUser: false },
    });
  }
});

client.login(process.env.DISCORD_TOKEN);