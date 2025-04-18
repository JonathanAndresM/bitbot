import fs from 'fs';
import path from 'path';

const niveles = [
  { nombre: 'roca', puntos: 0 },
  { nombre: 'bronce', puntos: 100 },
  { nombre: 'plata', puntos: 200 },
  { nombre: 'oro', puntos: 400 },
  { nombre: 'diamante', puntos: 700 },
];

export function getNivelPorPuntos(puntos) {
  return niveles
    .slice()
    .reverse()
    .find(n => puntos >= n.puntos);
}

export function actualizarPuntosYNivel(guild, userId, puntosGanados) {
  const puntosPath = path.join('data', 'puntos.json');
  let data = {};

  if (fs.existsSync(puntosPath)) {
    data = JSON.parse(fs.readFileSync(puntosPath, 'utf8'));
  }

  if (!data[userId]) data[userId] = { puntos: 0, nivel: 'roca' };

  data[userId].puntos += puntosGanados;
  const nuevoNivel = getNivelPorPuntos(data[userId].puntos);

  const nivelAnterior = data[userId].nivel;
  data[userId].nivel = nuevoNivel.nombre;

  fs.writeFileSync(puntosPath, JSON.stringify(data, null, 2));

  if (guild) {
    const miembro = guild.members.cache.get(userId);
    if (miembro && nivelAnterior !== nuevoNivel.nombre) {
      actualizarRolesSegunNivel(miembro, nuevoNivel.nombre);
    }
  }
}

export async function actualizarRolesSegunNivel(member, nivel) {
  const rolesPorNivel = {
    oro: process.env.ROL_ORO_ID,
    diamante: process.env.ROL_DIAMANTE_ID,
    // otros niveles si los deseas
  };

  for (const rol of Object.values(rolesPorNivel)) {
    if (member.roles.cache.has(rol)) {
      await member.roles.remove(rol);
    }
  }

  if (rolesPorNivel[nivel]) {
    await member.roles.add(rolesPorNivel[nivel]);
  }
}
