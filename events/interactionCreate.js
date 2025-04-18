export default {
    // Este evento se activa cuando un usuario interactúa con un comando de barra
    name: 'interactionCreate',
    async execute(interaction, client) {
      if (!interaction.isChatInputCommand()) return;
  
      const comando = client.commands.get(interaction.commandName);
      if (!comando) return;
  
      try {
        await comando.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: '❌ Ocurrió un error al ejecutar el comando.',
          ephemeral: true,
        });
      }
    },
  };
  