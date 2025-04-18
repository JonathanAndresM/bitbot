import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('listbans')
    .setDescription('Muestra la lista de usuarios baneados en el servidor'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: '❌ No tenés permisos para ver los baneados.', ephemeral: true });
    }

    try {
      const banList = await interaction.guild.bans.fetch();

      if (banList.size === 0) {
        return interaction.reply('✅ No hay usuarios baneados en este servidor.');
      }

      const lista = banList.map(ban => `• **${ban.user.tag}** (ID: \`${ban.user.id}\`)`).slice(0, 20).join('\n');

      await interaction.reply({
        content: `📜 Lista de usuarios baneados:\n\n${lista}\n\nTotal: ${banList.size}`,
        ephemeral: true
      });

    } catch (error) {
      console.error('Error al obtener la lista de baneados:', error);
      return interaction.reply({
        content: '❌ Hubo un error al obtener la lista de baneados.',
        ephemeral: true
      });
    }
  }
};
// Este comando permite ver la lista de usuarios baneados en el servidor.
// Asegúrate de que el bot tenga permisos para ver la lista de baneados en el servidor.