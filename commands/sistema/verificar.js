import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  data: new SlashCommandBuilder()
    .setName('verificar')
    .setDescription('Verifica tu identidad y te da acceso al grupo correspondiente'),

  async execute(interaction) {
    const username = interaction.user.username;
    const userId = interaction.user.id;
    const guild = interaction.guild;

    const dbPath = process.env.USUARIOS_DATA_PATH;
    if (!fs.existsSync(dbPath)) {
      return interaction.reply({ content: '⚠️ No se encontró la base de datos de usuarios.', ephemeral: true });
    }

    const usersData = JSON.parse(fs.readFileSync(dbPath));
    const usuario = usersData.find(u => u.username === username);

    if (!usuario) {
        const register = process.env.REGISTER_URL;
      return interaction.reply({
        content: '❌ No estás registrado en la plataforma. Por favor registrate antes de verificarte. Aslo en el siguiente enlace: ' + register,
        ephemeral: true
      });
    }

    const canalNombre = usuario.grupo; // por ejemplo, "grupo_1"
    const canal = guild.channels.cache.find(c => c.name === canalNombre);

    if (!canal) {
      return interaction.reply({ content: `⚠️ El canal llamado "${canalNombre}" no fue encontrado.`, ephemeral: true });
    }

    // Le da permiso al usuario para ver el canal
    await canal.permissionOverwrites.edit(userId, {
      ViewChannel: true,
      SendMessages: true
    });

    return interaction.reply({
      content: `✅ ¡Has sido verificado! Ahora tenés acceso al canal **#${canal.name}**.`,
      ephemeral: true
    });
  }
};


/*import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = process.env.USUARIOS_DATA_PATH;

export default {
  data: new SlashCommandBuilder()
    .setName('verificar')
    .setDescription('Verifica a un usuario si está registrado en la base de datos.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario a verificar')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('usuario') || interaction.user;
    const miembro = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!miembro) {
      return interaction.reply({
        content: '❌ No se pudo encontrar al usuario en el servidor.',
        ephemeral: true
      });
    }

    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: '❌ No se encontró la base de datos de usuarios.',
        ephemeral: true
      });
    }

    const usuarios = JSON.parse(fs.readFileSync(dataPath));

    const registro = usuarios.find(user =>
      user.username.toLowerCase() === targetUser.username.toLowerCase()
    );

    if (!registro) {
      return interaction.reply({
        content: `⚠️ **${targetUser.username}** no está registrado en la base de datos.`,
        ephemeral: true
      });
    }

    if (!registro.grupo) {
      return interaction.reply({
        content: `⚠️ El usuario está registrado pero no tiene grupo asignado.`,
        ephemeral: true
      });
    }

    const nombreDelRol = registro.grupo.toLowerCase();
    const rol = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === nombreDelRol);

    if (!rol) {
      return interaction.reply({
        content: `⚠️ No se encontró el rol llamado **${nombreDelRol}** en el servidor.`,
        ephemeral: true
      });
    }

    if (miembro.roles.cache.has(rol.id)) {
      return interaction.reply({
        content: `✅ **${targetUser.username}** ya tiene el rol de **${rol.name}**.`,
        ephemeral: true
      });
    }

    await miembro.roles.add(rol);

    await interaction.reply({
      content: `✅ **${targetUser.username}** ha sido verificado y se le asignó el rol **${rol.name}**.`,
      ephemeral: false
    });
  }
};*/
