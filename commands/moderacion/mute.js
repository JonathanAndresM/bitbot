import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import ms from 'ms';
import { enviarLog } from '../../utils/logModeracion.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia a un usuario por un tiempo')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario a silenciar').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('duracion').setDescription('Duración (ej: 5m, 1h)').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon').setDescription('Razón del mute')
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true });
    }

    const usuario = interaction.options.getMember('usuario');
    const duracion = interaction.options.getString('duracion');
    const razon = interaction.options.getString('razon') || 'No especificada';

    if (!usuario.moderatable) {
      return interaction.reply({ content: '❌ No puedo mutear a ese usuario.', ephemeral: true });
    }

    const tiempoMs = ms(duracion);
    if (!tiempoMs || tiempoMs > 2419200000) { // 28 días max
      return interaction.reply({ content: '❌ Duración inválida. Máx: 28 días.', ephemeral: true });
    }

    await usuario.timeout(tiempoMs, razon);
    await interaction.reply(`🔇 ${usuario.user.tag} fue silenciado por ${duracion}.`);

    await enviarLog(interaction.guild, `🔇 ${usuario.user.tag} fue silenciado por ${interaction.user.tag} durante ${duracion}. Razón: ${razon}`);

    try {
      await usuario.send(`Has sido silenciado en **${interaction.guild.name}** por ${duracion}.\n**Razón:** ${razon}`);
    } catch {}
  }
};
// Este comando permite silenciar a un usuario por un tiempo específico y opcionalmente especificar una razón.
// Asegúrate de que el bot tenga permisos para gestionar los roles de los miembros en el servidor.