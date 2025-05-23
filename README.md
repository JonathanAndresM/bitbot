# 🤖 Discord Bot - Vinculación de Usuario y Email

Este proyecto consiste en un bot de Discord diseñado para **asistir a los nuevos miembros del servidor** en el proceso de **vincular su nombre de usuario con su correo electrónico**. Además, proporciona instrucciones claras y respuestas automatizadas para facilitar el registro y la orientación inicial.

---

## 🎯 Objetivo

El objetivo principal es **agilizar la gestión de nuevos miembros** dentro de un servidor de Discord grande, asegurando que cada usuario reciba asistencia de manera rápida y eficaz.

Este bot representa el **primer paso** hacia un proyecto más ambicioso que busca gestionar equipos, usuarios y permisos en una comunidad de hasta 1000 personas organizadas en grupos.

---

## ✨ Funcionalidades

- ✅ **Bienvenida automática**: Cuando un nuevo miembro se une al servidor, el bot lo saluda y le sugiere cómo iniciar el proceso de registro.

- 💬 **Comando `/ayuda`**: Ofrece una guía con los pasos necesarios para vincular el correo electrónico con el nombre de usuario.

- 📣 **Respuesta a menciones**: Si el bot es mencionado, responde con un mensaje orientativo.

---

## 🛠 Requisitos

Antes de comenzar, asegúrate de tener lo siguiente instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- Un **token de bot** de Discord y el **ID de la aplicación**, disponibles desde el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications)

---

## 🚀 Instalación

1. **Clona el repositorio**:

```bash
   git clone https://github.com/TeewsPepper/bitbot.git
   cd bitbot


2. Instala las dependencias:

```bash
npm install


# Configura el entorno: Crea un archivo .env en la raíz del proyecto y agrega lo siguiente:

DISCORD_TOKEN=tu_token_aqui
APPLICATION_ID=tu_id_de_aplicacion_aqui
CANAL_BIENVENIDA_ID=id_del_canal_de_bienvenida

3. Ejecuta el bot:

node utils/clearCommands.js

node utils/registerCommands.js

node index.js

## Si todo está correcto, verás en la consola:

    ✅ Bot conectado como [tu_bot]

 ```   

🧩 Estructura del Proyecto

bitbot/
├── index.js              # Lógica principal del bot
├── .env                  # Variables de entorno (no subir a Git)
├── .gitignore            # Archivos y directorios que no queremos subir al repo     
├── package.json          # Configuración del proyecto y dependencias
└── README.md             # Este archivo

🤝 Contribuciones

¿Te interesa aprender sobre control de versiones y desarrollo colaborativo? ¡Este proyecto es una excelente oportunidad para empezar!
Cómo contribuir:

    Haz un fork del repositorio.

    Crea una nueva rama:

    
```bash
git checkout -b mi-nueva-funcionalidad

# Realiza tus cambios y verifica que todo funcione correctamente.

# Sube tus cambios:

    git push origin mi-nueva-funcionalidad

    # Abre un pull request desde GitHub.
```
    💡 Asegúrate de que tus cambios estén bien documentados y enfocados en mejorar la funcionalidad o la claridad del proyecto.

🧠 Nota final

Este bot no es solo una herramienta funcional, sino también un espacio de aprendizaje colectivo. Participar en su desarrollo puede ayudarte a:

    Mejorar tus habilidades con JavaScript y Node.js

    Aprender a usar Git y GitHub de forma colaborativa

    Contribuir a un proyecto real en crecimiento

¡Toda participación suma! 💪✨