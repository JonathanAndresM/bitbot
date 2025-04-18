// utils/clearCommands.js
import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('🧹 Borrando todos los comandos...');
  await rest.put(
    Routes.applicationCommands(process.env.APPLICATION_ID),
    { body: [] }
  );
  console.log('✅ Comandos eliminados.');
} catch (error) {
  console.error('❌ Error al eliminar comandos:', error);
}
