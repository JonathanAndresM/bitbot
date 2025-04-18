import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { enviarLog } from '../../utils/logModeracion.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario a expulsar').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon').setDescription('Razón de la expulsión')
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos para expulsar miembros.', ephemeral: true });
    }

    const usuario = interaction.options.getMember('usuario');
    const razon = interaction.options.getString('razon') || 'No especificada';

    if (!usuario.kickable) {
      return interaction.reply({ content: '❌ No puedo expulsar a ese usuario.', ephemeral: true });
    }

    try {
      await usuario.send(`🚪 Has sido expulsado de **${interaction.guild.name}**.\n**Razón:** ${razon}`);
    } catch {}

    await usuario.kick(razon);
    await interaction.reply(`🚪 ${usuario.user.tag} fue expulsado del servidor.`);

    await enviarLog(interaction.guild, `🚪 ${usuario.user.tag} fue expulsado por ${interaction.user.tag}.\n**Razón:** ${razon}`);
  }
};
// Este comando permite expulsar a un usuario del servidor y opcionalmente especificar una razón.
// Asegúrate de que el bot tenga permisos para expulsar miembros en el servidor.