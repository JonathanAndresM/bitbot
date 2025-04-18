import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { enviarLog } from '../../utils/logModeracion.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Quita el mute a un usuario')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario a desmutear').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true });
    }

    const usuario = interaction.options.getMember('usuario');

    if (!usuario || !usuario.isCommunicationDisabled()) {
      return interaction.reply({ content: '❌ Este usuario no está muteado.', ephemeral: true });
    }

    await usuario.timeout(null);
    await interaction.reply(`🔈 ${usuario.user.tag} fue desmuteado.`);

    await enviarLog(interaction.guild, `🔈 ${usuario.user.tag} fue desmuteado por ${interaction.user.tag}.`);

    try {
      await usuario.send(`Tu silencio en **${interaction.guild.name}** fue levantado.`);
    } catch {}
  }
};
// Este comando permite quitar el mute a un usuario en el servidor.
// Asegúrate de que el bot tenga permisos para gestionar los roles de los miembros en el servidor.