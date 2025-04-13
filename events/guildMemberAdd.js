import fs from 'fs';
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
};
