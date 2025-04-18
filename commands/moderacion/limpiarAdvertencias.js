import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { cargarAdvertencias, guardarAdvertencias } from '../../utils/warnings.js';
import { enviarLog } from '../../utils/logModeracion.js';

export default {
  data: new SlashCommandBuilder()
    .setName('limpiar-advertencias')
    .setDescription('Limpia todas las advertencias de un usuario')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario a limpiar').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true });
    }

    const usuario = interaction.options.getUser('usuario');
    const warnings = cargarAdvertencias();
    const key = `${interaction.guild.id}-${usuario.id}`;

    if (warnings[key]) {
      delete warnings[key];
      guardarAdvertencias(warnings);
      await interaction.reply(`🧹 Se limpiaron las advertencias de ${usuario.username}.`);
      await enviarLog(interaction.guild, `🧹 ${usuario.tag} tuvo sus advertencias limpiadas por ${interaction.user.tag}`);
    } else {
      await interaction.reply(`${usuario.username} no tiene advertencias.`);
    }
  }
};
