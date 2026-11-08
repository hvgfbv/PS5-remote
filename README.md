# Mando PS5 (PS5 Remote Web App)

Una web app sencilla para **encender tu PS5 desde el iPhone** (o cualquier navegador de tu red). Un servidor pequeño de Node corre en un Mac o PC y usa [playactor](https://github.com/dhleong/playactor) para hablar con la consola.

A simple web app to **wake your PS5 from your phone**. A tiny Node server runs on a Mac/PC and uses [playactor](https://github.com/dhleong/playactor) to talk to the console.

## Qué hace / What it does

| Función | Estado |
| --- | --- |
| Encender la PS5 desde reposo (botón grande) | Funciona |
| Estado de la consola (encendida / en reposo / sin respuesta) | Funciona |
| Contador de tiempo encendida | Funciona |
| Lista de juegos pendientes (se guarda en el navegador) | Funciona |
| Botón "Poner en reposo" y apagado automático | **Puede no funcionar** (ver abajo) |

**Limitación conocida:** en algunas PS5 (probado en una con sistema `14220000`) playactor se conecta y se desconecta sin ejecutar `standby` ni `start-id`. El encendido sí funciona, porque usa otro método. Si tu consola sí obedece `playactor standby`, el botón de reposo y el apagado automático funcionarán. Para apagar siempre puedes usar el control o la app oficial PlayStation con Remote Play.

## Requisitos

- Node.js (LTS). Si el login de playactor se cierra solo con Node muy nuevo, haz el login con Node 22: `npx -y node@22 "$(which playactor)" login`.
- `playactor`: `npm install -g playactor`
- PS5 y computador en la misma red.
- En la PS5, en Ajustes > Sistema > Ahorro de energía > Funciones disponibles en modo reposo, activa **Mantener conexión a internet** y **Activar encendido de PS5 desde la red**.
- En la PS5, en Ajustes > Sistema > Uso remoto, activa el uso remoto.

## Instalación

1. Registra tu PS5 una sola vez:

   ```
   playactor login
   ```

   Se abre el navegador para iniciar sesión en PlayStation. Cuando la página diga "redirect", copia la dirección de la barra y pégala en la Terminal. Después, en la PS5, entra en Ajustes > Sistema > Uso remoto > Vincular dispositivo y escribe el PIN.

   > No compartas esa dirección `https://remoteplay...` con nadie: contiene un código de tu cuenta.

2. Descarga este repositorio y arranca el servidor con la IP de tu PS5 (la ves en Ajustes > Red > Ver estado de conexión):

   ```
   PS5_IP=192.168.1.50 node server.js
   ```

   En Windows (PowerShell): `$env:PS5_IP="192.168.1.50"; node server.js`

3. Abre `http://IP-DE-TU-COMPUTADOR:3000` en el navegador del teléfono. En iPhone: Compartir > Añadir a pantalla de inicio.

## Seguridad

El servidor **no tiene contraseña**. Úsalo solo en tu red de casa y no lo expongas a internet.

## Archivos

- `server.js`: servidor HTTP sin dependencias; llama a `playactor`.
- `index.html`: la interfaz.

## Licencia

MIT. Este proyecto no está afiliado a Sony. Usa playactor bajo tu propia responsabilidad.
