import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { enviarLog } from '../../utils/logModeracion.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario a banear').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon').setDescription('Razón del baneo')
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos para banear miembros.', ephemeral: true });
    }

    const usuario = interaction.options.getMember('usuario');
    const razon = interaction.options.getString('razon') || 'No especificada';

    if (!usuario.bannable) {
      return interaction.reply({ content: '❌ No puedo banear a ese usuario.', ephemeral: true });
    }

    try {
      await usuario.send(`⛔ Has sido baneado de **${interaction.guild.name}**.\n**Razón:** ${razon}`);
    } catch {}

    await usuario.ban({ reason: razon });
    await interaction.reply(`⛔ ${usuario.user.tag} fue baneado del servidor.`);

    await enviarLog(interaction.guild, `⛔ ${usuario.user.tag} fue baneado por ${interaction.user.tag}.\n**Razón:** ${razon}`);
  }
};
// Este comando permite banear a un usuario del servidor y opcionalmente especificar una razón.
// Asegúrate de que el bot tenga permisos para banear miembros en el servidor.