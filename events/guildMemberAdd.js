export default {
    // Este evento se activa cuando un nuevo miembro se une al servidor
    name: 'guildMemberAdd',
    async execute(member) {
      const canal = member.guild.channels.cache.get(process.env.CANAL_BIENVENIDA_ID);
      if (canal) {
        canal.send(`¡Bienvenido ${member.user.username} al servidor! 🎉`);
      }
  
      try {
        await member.send('¡Bienvenido! Escribí `/ayuda` para registrarte.');
      } catch (err) {
        console.error('❌ No se pudo enviar DM al nuevo miembro.');
      }
    },
  };
  