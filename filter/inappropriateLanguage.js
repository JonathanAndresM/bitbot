const palabrasInapropiadas = [
    'estúpido', 'idiota', 'imbécil', 'mierda', 'maldito', 'demonio'
  ];
  
  // Palabras que si están cerca (antes o después) indican contexto neutral
  const contextoPermitido = {
    'demonio': ['personaje', 'historia', 'juego', 'anime'],
  };
  
  export function detectarLenguajeInapropiado(mensaje) {
    const contenido = mensaje.content.toLowerCase();
    const palabras = contenido.split(/\s+/);
  
    let totalDetectadas = [];
  
    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
  
      if (palabrasInapropiadas.includes(palabra)) {
        // Analiza el contexto de la palabra (una antes y una después)
        const anterior = palabras[i - 1] || '';
        const siguiente = palabras[i + 1] || '';
  
        const contexto = contextoPermitido[palabra];
        if (contexto && (contexto.includes(anterior) || contexto.includes(siguiente))) {
          continue; // no cuenta como insulto si hay contexto válido
        }
  
        totalDetectadas.push(palabra);
      }
    }
  
    return totalDetectadas;
  }
  