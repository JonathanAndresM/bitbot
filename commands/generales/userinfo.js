import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Muestra información sobre un usuario')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario del que obtener información').setRequired(false)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario') || interaction.user;
    const miembro = await interaction.guild.members.fetch(usuario.id);

    const joinedAt = new Date(miembro.joinedTimestamp).toLocaleDateString();
    const createdAt = new Date(usuario.createdTimestamp).toLocaleDateString();
    
    const embed = {
      color: 0x0099ff,
      title: `Información de ${usuario.tag}`,
      fields: [
        { name: 'ID', value: usuario.id },
        { name: 'Cuenta creada', value: createdAt },
        { name: 'Se unió al servidor', value: joinedAt },
        { name: 'Estado', value: miembro.presence ? miembro.presence.status : 'Desconocido' },
        { name: 'Roles', value: miembro.roles.cache.map(role => role.name).join(', ') || 'Ninguno' }
      ],
      thumbnail: {
        url: usuario.displayAvatarURL({ dynamic: true, size: 1024 })
      }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
