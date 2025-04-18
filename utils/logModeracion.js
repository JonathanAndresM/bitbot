import { ChannelType } from 'discord.js';

export async function enviarLog(guild, mensaje) {
  const logChannelId = process.env.CANAL_LOGS_ID;

  const canal = guild.channels.cache.get(logChannelId);
  if (!canal || canal.type !== ChannelType.GuildText) return;

  try {
    await canal.send(mensaje);
  } catch (error) {
    console.error('Error al enviar log de moderación:', error);
  }
}
