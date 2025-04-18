import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/palabrasInapropiadas.json');

export default {
  data: new SlashCommandBuilder()
    .setName('listar-palabras')
    .setDescription('Muestra todas las palabras inapropiadas registradas.'),

  async execute(interaction) {
    let palabrasData = [];

if (fs.existsSync(dataPath)) {
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  palabrasData = rawData.palabras || [];
}

    if (palabrasData.length === 0) {
      return interaction.reply({
        content: '⚠️ No hay palabras registradas todavía.',
        ephemeral: true,
      });
    }

    const fields = palabrasData.map((item, index) => ({
      name: `${index + 1}. ${item.palabra}`,
      value: item.contextoPermitido || 'Sin contexto permitido.',
      inline: false,
    }));

    await interaction.reply({
      embeds: [
        {
          title: '📜 Lista de palabras inapropiadas',
          color: 0xff5555,
          fields: fields,
        },
      ],
      ephemeral: true,
    });
  },
};