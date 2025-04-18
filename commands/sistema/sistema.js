import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas a los archivos de datos
const nivelesPath = path.join(__dirname, '../../data/colaboradores.json');
const puntosPath = path.join(__dirname, '../../data/puntos.json');

// Niveles válidos
const niveles = ['roca', 'bronce', 'plata', 'oro', 'diamante'];

// Cargar datos
let nivelesData = {};
let puntosData = {};
if (fs.existsSync(nivelesPath)) {
  nivelesData = JSON.parse(fs.readFileSync(nivelesPath));
}
if (fs.existsSync(puntosPath)) {
  puntosData = JSON.parse(fs.readFileSync(puntosPath));
}

export default {
  data: new SlashCommandBuilder()
    .setName('sistema')
    .setDescription('Sistema interno de colaboradores')
    .addSubcommand(sub =>
      sub.setName('nivel')
        .setDescription('Muestra tu nivel actual'))
    .addSubcommand(sub =>
      sub.setName('subir')
        .setDescription('Sube de nivel a un colaborador')
        .addUserOption(opt =>
          opt.setName('usuario')
            .setDescription('El colaborador')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('bajar')
        .setDescription('Baja de nivel a un colaborador')
        .addUserOption(opt =>
          opt.setName('usuario')
            .setDescription('El colaborador')
            .setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('usuario') || interaction.user;

    if (sub === 'nivel') {
      const userData = puntosData[user.id] || { puntos: 0, nivel: 'roca' };
      return interaction.reply({
        embeds: [
          {
            title: '📊 Tu nivel',
            description: `Nivel: **${userData.nivel}**\nPuntos: **${userData.puntos}**`,
            color: 0x0099ff,
          },
        ],
        ephemeral: true,
      });
    }

    // Para subir o bajar nivel
    if (!user || user.bot) {
      return interaction.reply({ content: '❌ Usuario inválido.', ephemeral: true });
    }

    const nivelActual = nivelesData[user.id] || niveles[0];
    const indice = niveles.indexOf(nivelActual);
    let nuevoNivel = nivelActual;

    if (sub === 'subir') {
      if (indice === niveles.length - 1) {
        return interaction.reply({ content: `⚠️ ¡${user.username} ya está en el nivel más alto!`, ephemeral: true });
      }

      nuevoNivel = niveles[indice + 1];
      nivelesData[user.id] = nuevoNivel;

      if (nuevoNivel === 'oro') {
        const miembro = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (miembro) {
          const rolOro = interaction.guild.roles.cache.get(process.env.ROL_ORO_ID);
          if (rolOro) await miembro.roles.add(rolOro);
        }
      }

    } else if (sub === 'bajar') {
      if (indice === 0) {
        return interaction.reply({ content: `⚠️ ¡${user.username} ya está en el nivel más bajo!`, ephemeral: true });
      }

      nuevoNivel = niveles[indice - 1];
      nivelesData[user.id] = nuevoNivel;

      if (nivelActual === 'oro') {
        const miembro = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (miembro) {
          const rolOro = interaction.guild.roles.cache.get(process.env.ROL_ORO_ID);
          if (rolOro && miembro.roles.cache.has(rolOro.id)) {
            await miembro.roles.remove(rolOro);
          }
        }
      }
    }

    fs.writeFileSync(nivelesPath, JSON.stringify(nivelesData, null, 2));

    return interaction.reply({
      content: `✅ El usuario **${user.username}** ahora está en el nivel **${nuevoNivel.toUpperCase()}**.`,
      ephemeral: true,
    });
  }
};
