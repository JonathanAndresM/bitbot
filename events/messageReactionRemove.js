import { actualizarPuntosYNivel } from '../utils/colaboradores.js';

const emojisPositivos = ['👍', '❤️', '🔥', '💯', '✨'];

export default {
  name: 'messageReactionRemove',

  async execute(reaction, user) {
    if (user.bot) return;

    const { message } = reaction;
    const receptor = message.author;

    if (!receptor || receptor.bot || receptor.id === user.id) return;
    if (!emojisPositivos.includes(reaction.emoji.name)) return;

    await actualizarPuntosYNivel(message.guild, receptor.id, -2);
  },
};
