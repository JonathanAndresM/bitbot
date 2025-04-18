import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Muestra información sobre el servidor'),

  async execute(interaction) {
    const guild = interaction.guild;

    const owner = await guild.fetchOwner();
    const totalMembers = guild.memberCount;
    const totalBots = guild.members.cache.filter(member => member.user.bot).size;
    const totalHumans = totalMembers - totalBots;

    const embed = {
      color: 0x0099ff,
      title: `Información del servidor: ${guild.name}`,
      fields: [
        { name: 'ID del servidor', value: guild.id },
        { name: 'Propietario', value: owner.user.tag },
        { name: 'Miembros', value: `${totalMembers} (Humanos: ${totalHumans}, Bots: ${totalBots})` },
        { name: 'Canales', value: `${guild.channels.cache.size}` },
        { name: 'Fecha de creación', value: new Date(guild.createdTimestamp).toLocaleDateString() },
        { name: 'Región', value: guild.preferredLocale }
      ],
      thumbnail: {
        url: guild.iconURL({ dynamic: true, size: 1024 }) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
// Este comando muestra información sobre el servidor, incluyendo el propietario, número de miembros, canales, fecha de creación y región.