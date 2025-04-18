import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { cargarAdvertencias } from '../../utils/warnings.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ver-advertencias')
    .setDescription('Muestra la cantidad de advertencias de un usuario')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario a consultar').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true });
    }

    const usuario = interaction.options.getUser('usuario');
    const warnings = cargarAdvertencias();
    const key = `${interaction.guild.id}-${usuario.id}`;
    const cantidad = warnings[key] || 0;

    await interaction.reply(`📋 ${usuario.username} tiene ${cantidad} advertencia(s).`);
  }
};
// Este comando permite ver la cantidad de advertencias que tiene un usuario en el servidor.
// Asegúrate de que el bot tenga permisos para gestionar advertencias y que el comando esté registrado correctamente.