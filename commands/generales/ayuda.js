import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Muestra la ayuda para el registro'),
  async execute(interaction) {
    await interaction.reply({
      content: '**📌 Pasos para registrarte:**\n1. Verifica tu email\n2. Completa tu perfil con `/perfil`\n3. ¡Listo!',
      ephemeral: true,
    });
  },
};
