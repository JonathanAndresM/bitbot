import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { palabrasInapropiadas } from '../data/palabrasInapropiadas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo donde se guardan los puntos
const dataPath = path.join(__dirname, '../data/colaboradores.json');
let data = {};

if (fs.existsSync(dataPath)) {
  data = JSON.parse(fs.readFileSync(dataPath));
}

// Niveles y puntos necesarios para cada uno
const niveles = {
  roca: 0,
  bronce: 100,
  plata: 250,
  oro: 750,
  diamante: 1750,
};

// Función para detectar lenguaje inapropiado con contexto
const detectarLenguajeInapropiado = (mensaje) => {
    let puntosPerdidos = 0;
    const mensajeLower = mensaje.toLowerCase();
  
    palabrasInapropiadas.forEach(({ palabra, contextosPermitidos }) => {
      if (mensajeLower.includes(palabra)) {
        const tieneContextoPermitido = contextosPermitidos.some(ctx =>
          mensajeLower.includes(ctx)
        );
  
        if (!tieneContextoPermitido) {
          puntosPerdidos += 5;
        }
      }
    });
  
    return puntosPerdidos;
  };

// Función para subir de nivel automáticamente
const subirDeNivel = (userId, currentPoints) => {
  const nivelesArray = Object.keys(niveles);
  let nuevoNivel = 'roca';

  for (const nivel of nivelesArray) {
    if (currentPoints >= niveles[nivel]) {
      nuevoNivel = nivel;
    }
  }

  return nuevoNivel;
};

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const userId = message.author.id;
    const contenidoMensaje = message.content.trim();

    if (contenidoMensaje.length <= 250) return;

    if (!data[userId]) {
      data[userId] = { points: 0, level: 'roca' };
    }

    const miembro = await message.guild.members.fetch(userId).catch(() => null);

    // Penalizar si está muteado
    if (miembro && miembro.roles.cache.has(process.env.ROL_MUTE_ID)) {
      const puntosParaSiguienteNivel = Object.values(niveles)[Object.values(niveles).indexOf(data[userId].points) + 1];
      const puntosAQuitar = (puntosParaSiguienteNivel - data[userId].points) / 2;
      data[userId].points -= puntosAQuitar;
      message.channel.send(`⚠️ **${message.author.username}** ha sido penalizado por estar muteado y ha perdido ${Math.floor(puntosAQuitar)} puntos.`);
    }

    // Detección de lenguaje inapropiado
    const puntosPorLenguaje = detectarLenguajeInapropiado(contenidoMensaje);
    if (puntosPorLenguaje > 0) {
      data[userId].points -= puntosPorLenguaje;
      message.channel.send(`⚠️ **${message.author.username}** ha perdido ${puntosPorLenguaje} puntos por usar lenguaje inapropiado.`);
    }

    // Penalización por advertencia
    if (message.content.toLowerCase().includes('advertencia')) {
      data[userId].points -= 20;
      message.channel.send(`⚠️ **${message.author.username}** ha recibido una advertencia y ha perdido 20 puntos.`);
    }

    // Aumentar puntos por actividad
    data[userId].points += 10;

    // Recalcular nivel
    const nuevoNivel = subirDeNivel(userId, data[userId].points);
    if (nuevoNivel !== data[userId].level) {
      data[userId].level = nuevoNivel;

      if (nuevoNivel === 'oro') {
        const rolOro = message.guild.roles.cache.get(process.env.ROL_ORO_ID);
        if (rolOro && miembro && !miembro.roles.cache.has(rolOro.id)) {
          await miembro.roles.add(rolOro);
          message.channel.send(`🎉 **${message.author.username}** ha subido a **${nuevoNivel.toUpperCase()}** y ha recibido el rol de **oro**!`);
        }
      }
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }
};
// Este código se encarga de gestionar el sistema de puntos y niveles de los colaboradores en un servidor de Discord.
// Penaliza el uso de lenguaje inapropiado y gestiona la subida de niveles automáticamente.