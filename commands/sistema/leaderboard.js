import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const puntosPath = path.join(__dirname, '../../data/puntos.json');

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('🏆 Muestra el ranking de los colaboradores con más puntos'),

  async execute(interaction) {
    if (!fs.existsSync(puntosPath)) {
      return interaction.reply({ content: '❌ Aún no hay datos para mostrar.', ephemeral: true });
    }

    const puntosData = JSON.parse(fs.readFileSync(puntosPath, 'utf-8'));

    // Convertir a array y ordenar por puntos descendente
    const topUsuarios = Object.entries(puntosData)
      .map(([id, datos]) => ({ id, ...datos }))
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 10);

    if (topUsuarios.length === 0) {
      return interaction.reply({ content: '❌ No hay usuarios con puntos aún.', ephemeral: true });
    }

    const lista = await Promise.all(
      topUsuarios.map(async (user, index) => {
        const miembro = await interaction.guild.members.fetch(user.id).catch(() => null);
        const nombre = miembro ? miembro.user.username : `Usuario desconocido (${user.id})`;
        return `**#${index + 1}** - ${nombre} | ${user.puntos} puntos | Nivel: ${user.nivel}`;
      })
    );

    const embed = {
      title: '🏆 Ranking de colaboradores',
      description: lista.join('\n'),
      color: 0xf1c40f,
      footer: { text: 'Solo se muestran los 10 usuarios con más puntos.' },
    };

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
