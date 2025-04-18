export default {
  // Este evento se activa cuando el bot está listo y conectado
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`✅ Bot conectado como ${client.user.tag}`);
    },
  };
  