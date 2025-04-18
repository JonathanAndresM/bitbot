import fs from 'fs';
const ruta = './data/warnings.json';

export function cargarAdvertencias() {
  try {
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, '{}');
    const data = fs.readFileSync(ruta);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al cargar advertencias:', err);
    return {};
  }
}

export function guardarAdvertencias(data) {
  try {
    fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error al guardar advertencias:', err);
  }
}