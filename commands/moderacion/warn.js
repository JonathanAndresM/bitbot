import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { cargarAdvertencias, guardarAdvertencias } from '../../utils/warnings.js';
import { enviarLog } from '../../utils/logModeracion.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Advierte a un usuario')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(opt => opt.setName('razon').setDescription('Razón')),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ Sin permisos.', ephemeral: true });
    }

    const usuario = interaction.options.getUser('usuario');
    const razon = interaction.options.getString('razon') || 'No especificada';

    const warnings = cargarAdvertencias();
    const key = `${interaction.guild.id}-${usuario.id}`;
    warnings[key] = (warnings[key] || 0) + 1;
    guardarAdvertencias(warnings);

    await interaction.reply(`⚠️ ${usuario.username} fue advertido. Total: ${warnings[key]}`);
    await enviarLog(interaction.guild, `⚠️ ${usuario.tag} fue advertido por ${interaction.user.tag}. Razón: ${razon}`);

    try {
      await usuario.send(`⚠️ Has sido advertido en **${interaction.guild.name}**.\n**Razón:** ${razon}`);
    } catch {}
  }
};
// Este comando permite advertir a un usuario en el servidor y opcionalmente especificar una razón.
// También lleva un registro de las advertencias y envía un mensaje privado al usuario advertido.