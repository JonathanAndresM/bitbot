const { PermissionsBitField } = require('discord.js');
const verifyUser = require('../../utils/verifyUser.js');

module.exports = {
  data: {
    name: 'verificar',
    description: 'Verifica tu usuario o el de otro miembro (admins)',
    options: [
      {
        name: 'usuario',
        description: 'El usuario a verificar',
        type: 6, // USER
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const objetive = interaction.options.getUser('usuario') || interaction.user;
    const member = interaction.guild.members.cache.get(objetive.id);

    if (objetive.id !== interaction.user.id &&
        !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({
        content: '🚫 No tenés permisos para verificar a otros usuarios.',
        flags: 64,
      });
    }

    await verifyUser(member);
    await interaction.reply({
      content: `🔍 Verificando a ${objetive.username}...`,
      flags: 64,
    });
  },
};
