/*import 'dotenv/config';
import { readdirSync } from 'fs';
import { join } from 'path';
import { REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const comandos = [];
const comandosPath = join(__dirname, '../commands');

for (const categoria of readdirSync(comandosPath)) {
  for (const archivo of readdirSync(join(comandosPath, categoria)).filter(f => f.endsWith('.js'))) {
    const { default: comando } = await import(`../commands/${categoria}/${archivo}`);
    comandos.push(comando.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('🔄 Registrando comandos...');
  await rest.put(
    Routes.applicationCommands(process.env.APPLICATION_ID),
    { body: comandos }
  );
  console.log('✅ Comandos registrados correctamente.');
} catch (error) {
  console.error('❌ Error al registrar comandos:', error);
}*/

import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const foldersPath = path.join(__dirname, '..', 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(`file://${filePath}`)).default;
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('🔄 Registrando comandos de barra...');

  await rest.put(
    Routes.applicationCommands(process.env.APPLICATION_ID),
    { body: commands }
  );

  console.log('✅ Comandos registrados exitosamente.');
} catch (error) {
  console.error('❌ Error al registrar comandos:', error);
}