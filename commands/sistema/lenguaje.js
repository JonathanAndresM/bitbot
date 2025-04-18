import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const palabrasPath = path.join(__dirname, '../../data/palabrasInapropiadas.json');

export default {
  data: new SlashCommandBuilder()
    .setName('lenguaje')
    .setDescription('Gestiona el lenguaje inapropiado')
    .addSubcommand(sub =>
      sub.setName('agregar')
        .setDescription('Agrega una nueva palabra inapropiada')
        .addStringOption(opt =>
          opt.setName('palabra')
            .setDescription('Palabra a marcar como inapropiada')
            .setRequired(true))
        .addStringOption(opt =>
          opt.setName('contexto')
            .setDescription('Contexto permitido (opcional)')
            .setRequired(false))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'agregar') {
      const palabra = interaction.options.getString('palabra').toLowerCase();
      const contexto = interaction.options.getString('contexto') || null;

      let data = { palabras: [] };
      if (fs.existsSync(palabrasPath)) {
        data = JSON.parse(fs.readFileSync(palabrasPath, 'utf-8'));
      }

      // Verificar si ya existe
      const yaExiste = data.palabras.find(p => p.palabra === palabra);
      if (yaExiste) {
        return interaction.reply({ content: '⚠️ Esa palabra ya está registrada.', ephemeral: true });
      }

      data.palabras.push({ palabra, contexto });
      fs.writeFileSync(palabrasPath, JSON.stringify(data, null, 2));

      return interaction.reply({
        content: `✅ Palabra **"${palabra}"** agregada como inapropiada.${contexto ? ` Contexto permitido: "${contexto}"` : ''}`,
        ephemeral: true
      });
    }
  }
};
