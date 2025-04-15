import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChannelType, PermissionsBitField } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    const username = member.user.username;
    const userId = member.id;
    const guild = member.guild;

    const bienvenidaChannel = guild.channels.cache.get(process.env.CANAL_BIENVENIDA_ID);
    const dbPath = process.env.USUARIOS_DATA_PATH;

    if (!fs.existsSync(dbPath)) {
      return bienvenidaChannel?.send(`⚠️ No se encontró la base de datos de usuarios.`);
    }

    const usersData = JSON.parse(fs.readFileSync(dbPath));
    const usuario = usersData.find(u => u.username === username);

    if (usuario) {
      const canalNombre = usuario.grupo; // por ejemplo: "grupo_1"
      const canal = guild.channels.cache.find(c => c.name === canalNombre && c.type === ChannelType.GuildText);

      if (canal) {
        await canal.permissionOverwrites.edit(userId, {
          ViewChannel: true,
          SendMessages: true
        });

        bienvenidaChannel?.send(`🎉 ¡Bienvenido **${username}**! Ya tenés acceso al canal **#${canal.name}**.`);
      } else {
        bienvenidaChannel?.send(`👋 Bienvenido **${username}**, pero no se encontró el canal correspondiente a tu grupo.`);
      }
    } else {
      const register = process.env.REGISTER_URL;
      bienvenidaChannel?.send(`👋 ¡Bienvenido **${username}**! No estás registrado aún. Por favor registrate correctamente en ${register} para que se te asignen los permisos.`);
    }
  }
};


/*import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { register } from 'module';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    const username = member.user.username;
    const fakeApiPath = path.resolve(process.env.FAKE_API_PATH);

    let usuariosRegistrados = [];

    try {
      const rawData = fs.readFileSync(fakeApiPath, 'utf8');
      usuariosRegistrados = JSON.parse(rawData);
    } catch (error) {
      console.error('❌ Error al leer el archivo de usuarios:', error);
      return;
    }

    const usuario = usuariosRegistrados.find(u => u.username === username);

    // Mensaje base de bienvenida
    let mensajeBienvenida = `🎉 ¡Bienvenido/a al servidor, **${username}**!`;

    if (usuario) {
      let rolId;

      switch (usuario.tipo) {
        case 'grupo1':
          rolId = process.env.ROL_GRUPO1_ID;
          break;
        case 'grupo2':
        default:
          rolId = process.env.ROL_GRUPO2_ID;
          break;
      }

      const rol = member.guild.roles.cache.get(rolId);
      const register = process.env.REGISTER_URL;
      if (rol) {
        await member.roles.add(rol);
        mensajeBienvenida += `\n✅ Se te ha asignado el rol de **${usuario.tipo}**. ¡Nos alegra tenerte aquí!`;
      } else {
        mensajeBienvenida += `\n⚠️ No se encontró el rol correspondiente para **${usuario.tipo}**. Contacta a un administrador.`;
      }
    } else {
      mensajeBienvenida += `\n⚠️ No encontramos tu registro en nuestra plataforma. Por favor, visita ${register} para completarlo.`;
    }

    // Enviar mensaje por DM
    try {
      await member.send(mensajeBienvenida);
    } catch (err) {
      console.warn(`⚠️ No se pudo enviar mensaje directo a ${username}.`);
    }

    // Enviar mensaje al canal público
    const canalBienvenida = member.guild.channels.cache.get(process.env.CANAL_BIENVENIDA_ID);
    if (canalBienvenida && canalBienvenida.isTextBased()) {
      canalBienvenida.send(mensajeBienvenida).catch(console.error);
    }
  }
};*/
