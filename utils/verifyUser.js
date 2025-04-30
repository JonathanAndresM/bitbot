const fs = require('fs');
const path = require('path');

module.exports = async function verifyUser(member) {
  const dbPath = process.env.USERS_DATA_PATH;
  if (!dbPath) return console.error('❌ Falta USERS_DATA_PATH en el .env');

  let data;
  try {
    const raw = fs.readFileSync(path.resolve(dbPath), 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    console.error('❌ Error al leer la base de datos de usuarios:', e);
    return;
  }

  if (!data || !Array.isArray(data.users)) {
    console.error('❌ El archivo dataUser.json no tiene el formato correcto.');
    return;
  }

  const user = data.users.find(
    u => u.username.toLowerCase() === member.user.username.toLowerCase()
  );

  const register = process.env.REGISTER_URL;

  if (!user) {
    try {
      await member.send({
        embeds: [
          {
            color: 0xff0000,
            title: '🚫 Usuario no registrado',
            description: [
              'Para poder acceder a los canales correspondientes a tu grupo, necesitás registrar tu nombre de usuario de Discord. A continuación te explicamos cómo hacerlo paso a paso:',
              '',
              '📝 **Paso 1: Completá el formulario de registro**',
              `👉 [Hacé clic acá para acceder al formulario](${register})`,
              '',
              '**¿Cómo registrarte correctamente?**',
              'a) Iniciá sesión con tu correo electrónico para verificar que estés registrado.',
              'b) Si estás registrado, verás tus datos junto con varias opciones.',
              'c) Hacé clic en el botón **"Continuar"** de la opción 3: **Acceso a Discord**.',
              `d) Ingresá nuevamente tu correo electrónico y tu usuario de Discord (>> **${member.user.username}** <<) en el formulario.`,
              'e) Al completar este paso, tu usuario quedará registrado.',
              '',
              '📨 **Paso 2: Ejecutá el comando de verificación**',
              'Volvé al servidor de Discord y usá el comando: `/verificar` (o `/verificar @tu_usuario` si sos admin).',
              '',
              '🔐 **Paso 3: Acceso automático**',
              'Una vez verificado, el sistema te dará acceso a los canales correspondientes a tu grupo.',
              '',
              '❓ **¿Necesitás ayuda?**',
              'Si tenés dudas o problemas, no dudes en contactar a un moderador del servidor.',
            ].join('\n'),
            image: {
              url: 'https://www.enriquedans.com/wp-content/uploads/2023/01/Source-code.jpeg' // Podés cambiarlo por una imagen real
            },
            footer: {
              text: 'Sistema de verificación del servidor',
            },
            timestamp: new Date().toISOString(),
          }
        ]
      });
    } catch (err) {
      console.error('No se pudo enviar mensaje privado al usuario:', err);
    }
    return;
  }


  const channel = member.guild.channels.cache.find(c => c.name === user.group);
  if (!channel) return console.warn(`⚠️ Canal "${user.group}" no encontrado.`);

  try {
    await channel.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    await member.send(`✅ Acceso otorgado al canal **#${channel.name}** según tu grupo.`);
  } catch (err) {
    console.error('❌ Error al asignar permisos:', err);
  }
};