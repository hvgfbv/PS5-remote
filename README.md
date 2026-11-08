# Mando PS5: enciende tu PS5 desde el celular

Una web app sencilla para **encender tu PlayStation 5 desde el iPhone, Android o cualquier navegador** conectado a tu red de casa. Tiene un botón grande de encendido, muestra si la consola está encendida o en reposo, cuenta el tiempo que lleva encendida y trae una lista de juegos pendientes.

Funciona con un servidor muy pequeño de Node.js que corre en tu Mac, PC o Linux. El celular abre una página de ese servidor, y el servidor usa [playactor](https://github.com/dhleong/playactor) para despertar la consola.

> English quick start at the [end of this page](#english-quick-start).

---

## Índice

1. [Qué hace y qué no hace](#1-qué-hace-y-qué-no-hace)
2. [Cómo funciona](#2-cómo-funciona)
3. [Lo que necesitas](#3-lo-que-necesitas)
4. [Paso 1: configurar la PS5](#paso-1-configurar-la-ps5)
5. [Paso 2: instalar Node.js](#paso-2-instalar-nodejs)
6. [Paso 3: instalar playactor](#paso-3-instalar-playactor)
7. [Paso 4: descargar este proyecto](#paso-4-descargar-este-proyecto)
8. [Paso 5: registrar tu PS5 (login)](#paso-5-registrar-tu-ps5-login)
9. [Paso 6: probar que tu PS5 se enciende desde la terminal](#paso-6-probar-que-tu-ps5-se-enciende-desde-la-terminal)
10. [Paso 7: arrancar el servidor](#paso-7-arrancar-el-servidor)
11. [Paso 8: abrir la app en el celular](#paso-8-abrir-la-app-en-el-celular)
12. [Uso diario](#uso-diario)
13. [Solución de problemas](#solución-de-problemas)
14. [Limitaciones conocidas](#limitaciones-conocidas)
15. [Seguridad y privacidad](#seguridad-y-privacidad)
16. [Referencia técnica](#referencia-técnica)
17. [Licencia](#licencia)

---

## 1. Qué hace y qué no hace

| Función | Estado |
| --- | --- |
| Encender la PS5 desde reposo (botón grande) | Funciona |
| Mostrar el estado: encendida, en reposo o sin respuesta | Funciona |
| Contador de tiempo encendida | Funciona |
| Lista de juegos pendientes (se guarda en el navegador del celular) | Funciona |
| Botón "Poner en reposo" | **Puede no funcionar** en tu consola |
| Apagado automático con temporizador | **Puede no funcionar** en tu consola |
| Abrir un juego concreto desde la app | **No incluido** (ver [limitaciones](#limitaciones-conocidas)) |

El botón de reposo y el temporizador dependen de que tu PS5 acepte el comando `playactor standby`. En algunas consolas no lo acepta, y por eso se explica en [limitaciones conocidas](#limitaciones-conocidas) cómo comprobarlo antes de contar con ellos.

## 2. Cómo funciona

```
Celular  --(Wi-Fi, página web)-->  Servidor Node (tu Mac/PC)  --(playactor)-->  PS5
```

1. En tu computador corre `server.js`, que sirve la página `index.html` y unas pocas rutas de API.
2. Al tocar el botón, la página le pide al servidor que despierte la consola.
3. El servidor ejecuta `playactor wake`, y la PS5 se enciende.
4. Cada pocos segundos la página pregunta el estado para mostrarte si está encendida o en reposo.

Por eso **el computador tiene que estar encendido y con el servidor abierto** cada vez que quieras usar la app.

## 3. Lo que necesitas

- Una **PS5** conectada a tu red (por cable o Wi-Fi).
- Un **computador** (macOS, Windows o Linux) en la misma red que la PS5, que se quede encendido mientras usas la app.
- Un **celular** o cualquier aparato con navegador, en la misma red Wi-Fi.
- Una **cuenta de PlayStation Network** (la misma que usas en la PS5).
- Unos 20 minutos la primera vez.

---

## Paso 1: configurar la PS5

Estos ajustes permiten que la consola escuche órdenes de la red cuando está en reposo. Hazlos con el control, en la PS5.

1. Abre **Ajustes** (el engranaje arriba a la derecha de la pantalla de inicio).
2. Ve a **Sistema > Ahorro de energía > Funciones disponibles en modo reposo**.
3. Activa estas dos opciones:
   - **Mantener conexión a internet**
   - **Activar encendido de PS5 desde la red**
4. Vuelve a Ajustes y ve a **Sistema > Uso remoto**. Activa **Activar uso remoto**.
5. Apunta la **dirección IP** de tu PS5: ve a **Ajustes > Red > Ver estado de conexión**. Es un número como `192.168.1.50`. Lo necesitarás más adelante.

En inglés, los menús se llaman: Settings > System > Power Saving > Features Available in Rest Mode (Stay Connected to the Internet, Enable Turning On PS5 from Network) y Settings > System > Remote Play (Enable Remote Play).

**Recomendación:** entra en el router y reserva esa IP para la PS5 (a veces se llama "DHCP reservation" o "IP fija"). Así no cambia y no tendrás que actualizarla.

## Paso 2: instalar Node.js

1. Entra a [nodejs.org](https://nodejs.org) y descarga la versión **LTS**.
2. Abre el instalador y sigue los pasos (Continuar, Instalar).
3. **Cierra la terminal por completo y ábrela de nuevo.**
4. Comprueba que quedó instalado:

   ```
   node -v
   ```

   Debe mostrar un número de versión, por ejemplo `v22.11.0`. Si dice `command not found`, repite el paso 3.

> **Cómo abrir la terminal:** en Mac, pulsa `Cmd + Espacio`, escribe "Terminal" y pulsa Enter. En Windows, busca "PowerShell" en el menú de inicio. En Linux, usa tu terminal habitual.

## Paso 3: instalar playactor

[playactor](https://github.com/dhleong/playactor) es la herramienta que habla con la PS5.

```
npm install -g playactor
```

- Tarda un minuto y muestra bastante texto. Es normal.
- Si da error de permisos (`EACCES`), en Mac y Linux repite el comando con `sudo` delante y escribe tu contraseña. No se ve mientras la escribes.

Comprueba que funciona:

```
playactor --help
```

Debe mostrar una lista de comandos, entre ellos `login`, `check`, `wake` y `standby`.

## Paso 4: descargar este proyecto

**Opción A, con git:**

```
git clone https://github.com/hvgfbv/PS5-remote.git
cd PS5-remote
```

**Opción B, sin git:** en esta página de GitHub pulsa el botón verde **Code** y luego **Download ZIP**. Descomprime la carpeta y entra en ella desde la terminal:

```
cd ruta/a/la/carpeta/PS5-remote
```

Dentro de la carpeta debes ver `index.html` y `server.js`. Compruébalo con `ls` (Mac y Linux) o `dir` (Windows).

## Paso 5: registrar tu PS5 (login)

Este paso se hace **una sola vez**. Le da permiso a playactor para hablar con tu consola.

1. **Enciende la PS5** y déjala en la pantalla de inicio. Debe estar en la misma red que tu computador.
2. En la terminal ejecuta:

   ```
   playactor login
   ```

3. Verás un mensaje que termina en `Hit ENTER to continue`. **Pulsa Enter una sola vez.**
4. Se abre el navegador con la página de inicio de sesión de PlayStation. Inicia sesión con tu cuenta.
5. Cuando la página muestre la palabra **"redirect"**, copia la dirección completa de la barra del navegador.
6. Vuelve a la terminal. **Comprueba que el cursor esté parpadeando esperando, sin una línea que termine en `%` o `$`.** Pega la dirección y pulsa Enter.
7. La terminal mostrará `Enter PIN here>`. En la PS5 ve a **Ajustes > Sistema > Uso remoto > Vincular dispositivo**. Aparece un código de 8 dígitos. Escríbelo en la terminal y pulsa Enter.
8. La PS5 muestra un aviso de "Uso remoto conectado" y se desconecta sola. Es normal: quiere decir que el registro quedó guardado.

> **Importante:** esa dirección que empieza con `https://remoteplay...` contiene un código de tu cuenta de PlayStation. **No la publiques ni la compartas** (ni en issues de GitHub, ni en chats). Se usa una sola vez y caduca, pero es mejor no exponerla.

### Si el login se cierra solo

Con versiones muy nuevas de Node (por ejemplo v26) puede pasar que `playactor login` muestre `Hit ENTER to continue`, vuelva a la línea de comandos sin esperar nada, y todo lo que pegues después se interprete como un comando. La solución es hacer el login con Node 22 solo para este paso:

```
npx -y node@22 "$(which playactor)" login
```

Si `npx` da un error de permisos sobre la carpeta `~/.npm`, suele ser porque instalaste algo con `sudo` antes. Devuélvete el permiso con:

```
sudo chown -R $(id -u):$(id -g) ~/.npm
```

y repite el comando de login.

## Paso 6: probar que tu PS5 se enciende desde la terminal

Antes de usar la app, comprueba que el encendido funciona por sí solo. Así sabes que el problema, si lo hay, no está en la app.

1. **Pon la PS5 en reposo** con el control: mantén pulsado el botón PS, elige **Energía** y luego **Activar modo reposo**. La luz debe quedar **naranja**. Si queda apagada del todo, la consola no está en reposo.
2. Espera unos 15 segundos y comprueba que playactor la ve (cambia la IP por la tuya):

   ```
   playactor check --ip 192.168.1.50
   ```

   Debe aparecer `"status": "STANDBY"`. Si dice `Unable to locate device`, revisa los ajustes del [paso 1](#paso-1-configurar-la-ps5) y que la luz sea naranja.
3. Enciéndela:

   ```
   playactor wake --ip 192.168.1.50
   ```

   La PS5 debe encenderse en unos segundos. Si es así, todo lo difícil ya está hecho.

## Paso 7: arrancar el servidor

En la carpeta del proyecto, ejecuta (con la IP de **tu** PS5):

**Mac y Linux:**

```
PS5_IP=192.168.1.50 node server.js
```

**Windows (PowerShell):**

```
$env:PS5_IP="192.168.1.50"; node server.js
```

Debe aparecer:

```
Mando PS5 listo en http://localhost:3000
```

**Deja esa terminal abierta.** Si la cierras, el servidor se detiene.

Prueba primero en el propio computador: abre `http://localhost:3000` en el navegador. Debes ver el mando. Con la PS5 en reposo, el estado debe decir "En reposo" (puede tardar hasta 20 segundos en actualizarse). Pulsa el botón grande y comprueba que la consola se enciende.

> **Importante:** pasa siempre `PS5_IP` con la IP de la consola. Con la PS5 en reposo, playactor a veces no la encuentra si no le das la IP.

## Paso 8: abrir la app en el celular

1. Averigua la IP de tu **computador** (no la de la PS5):
   - **Mac:** `ipconfig getifaddr en0` (si no sale nada, prueba `en1`).
   - **Linux:** `hostname -I`.
   - **Windows:** `ipconfig` y busca "Dirección IPv4".

   Es algo como `192.168.1.23`.
2. Conecta el celular a la **misma red Wi-Fi** que el computador.
3. Abre el navegador del celular (Safari en iPhone, Chrome en Android) y escribe:

   ```
   http://192.168.1.23:3000
   ```

   (con la IP de tu computador). Debe aparecer el mando.
4. **Para dejarla como app en el iPhone:** toca el botón Compartir (el cuadrado con una flecha hacia arriba), elige **Añadir a pantalla de inicio** y toca **Añadir**. Ábrela desde el ícono nuevo y se verá a pantalla completa.
   **En Android:** menú de Chrome (tres puntos) > **Añadir a pantalla de inicio**.

---

## Uso diario

1. En el computador, abre la terminal, entra en la carpeta y arranca el servidor ([paso 7](#paso-7-arrancar-el-servidor)).
2. Evita que el computador se duerma. En Mac, abre otra pestaña de terminal y ejecuta `caffeinate -s`.
3. Abre la app en el celular y toca el botón grande.

Para detener el servidor: en la terminal donde corre, pulsa `Ctrl + C`.

**Estados que muestra la app:**

| Texto | Significado |
| --- | --- |
| Encendida | La consola está despierta. El botón no hace nada, a propósito. |
| En reposo | La consola duerme y se puede encender. |
| No responde | El servidor no encuentra la consola, o el servidor está cerrado. |
| Estado desconocido | Todavía está buscando. Espera unos segundos. |

## Solución de problemas

| Problema | Causa probable | Qué hacer |
| --- | --- | --- |
| `node: command not found` | Node no está instalado, o la terminal es anterior a la instalación | Instala Node y abre una terminal nueva |
| `playactor: command not found` | playactor no está instalado | Repite el [paso 3](#paso-3-instalar-playactor) |
| `Unable to locate device` | La PS5 está apagada del todo, o no está en la misma red, o faltan los ajustes de reposo | Revisa que la luz sea naranja y los ajustes del [paso 1](#paso-1-configurar-la-ps5). Usa `--ip` |
| `EADDRINUSE ... port 3000` | Ya hay un servidor abierto en otra terminal | Ciérralo con `Ctrl + C`, o libera el puerto: `lsof -ti :3000 \| xargs kill` (Mac/Linux) |
| El servidor se cierra con `ENOENT ... index.html` | Falta `index.html` en la carpeta | Ejecuta el servidor desde la carpeta del proyecto y comprueba que ambos archivos están ahí |
| El celular no abre la página | Red distinta, firewall o IP incorrecta | Misma Wi-Fi, IP del computador (no de la PS5), puerto `3000` y firewall que permita Node |
| El botón muestra "No se pudo encender" | playactor no está registrado, o la IP es incorrecta | Repite el [paso 5](#paso-5-registrar-tu-ps5-login) y el [paso 6](#paso-6-probar-que-tu-ps5-se-enciende-desde-la-terminal) |
| `playactor login` se cierra sin esperar | Versión de Node demasiado nueva | Haz el login con Node 22 (ver [más arriba](#si-el-login-se-cierra-solo)) |
| `zsh: no matches found: https://...` | Pegaste la dirección en la terminal cuando no estaba esperando | Repite el login y pega solo cuando el cursor espere sin símbolo `%` |
| `zsh: parse error` o `bquote>` | Quedó texto pegado de antes en la línea | Pulsa `Ctrl + C` o abre una pestaña de terminal nueva |

Si nada funciona, abre un [issue](../../issues) con el mensaje de error. **Antes de pegar nada, borra tu nombre de usuario, tu IP, el nombre de tu consola y cualquier dirección `https://remoteplay...`.**

## Limitaciones conocidas

- **Poner en reposo y abrir juegos pueden no funcionar.** En la consola donde se probó este proyecto (PS5 con sistema `14220000`), playactor se conectaba y se desconectaba sin ejecutar `standby` ni `start-id`, aunque el registro estaba bien. El encendido sí funcionó, porque usa un método más simple (un aviso por la red), mientras que reposo y abrir juegos necesitan abrir una sesión de Remote Play completa. Para saber si tu consola lo acepta, prueba, con la PS5 encendida: `playactor standby --ip 192.168.1.50`. Si la luz pasa a naranja, el botón de reposo y el temporizador de la app funcionarán.
- **Abrir un juego desde la app no está incluido.** La documentación de playactor indica que iniciar apps y juegos solo está soportado en PS4, no en PS5.
- **La lista de juegos es manual.** La PS5 no entrega a playactor la lista de tus juegos instalados. Los pendientes se guardan solo en el navegador de cada aparato.
- El servidor tiene que estar corriendo en un computador encendido de tu red.
- Este proyecto depende de playactor, que no es una herramienta oficial de Sony y puede dejar de funcionar si Sony cambia el sistema.

**Alternativas para poner la PS5 en reposo:** con el control (botón PS, Energía, Modo reposo), con la app oficial **PlayStation** y Remote Play desde el celular, o con el ajuste de la propia consola en Ajustes > Sistema > Ahorro de energía > Establecer tiempo hasta modo reposo.

## Seguridad y privacidad

- **El servidor no tiene contraseña.** Cualquiera que esté en tu red y conozca la dirección puede encender tu consola. Úsalo solo en tu red de casa y **no lo expongas a internet** (ni con reenvío de puertos ni con túneles públicos).
- Las credenciales de playactor se guardan en tu computador (carpeta `~/.config/playactor`). **No las subas a ningún repositorio.**
- Este proyecto no envía datos a ningún servidor externo. La lista de juegos se guarda en el almacenamiento local de tu navegador.
- El archivo `ps5-data.json` (contador de tiempo) se crea al lado de `server.js` y está en `.gitignore`.

## Referencia técnica

**Archivos:**

- `server.js`: servidor HTTP sin dependencias que ejecuta `playactor`.
- `index.html`: la interfaz (HTML, CSS y JavaScript en un solo archivo).
- `ps5-data.json`: se crea solo; guarda los segundos que lleva encendida la consola.

**Variables de entorno:**

| Variable | Valor por defecto | Para qué sirve |
| --- | --- | --- |
| `PS5_IP` | (vacía) | IP de la PS5. Muy recomendable. |
| `PORT` | `3000` | Puerto del servidor |

**Rutas de la API:**

| Ruta | Método | Qué hace |
| --- | --- | --- |
| `/api/status` | GET | Devuelve el estado, los segundos encendida y el fin del temporizador |
| `/api/wake` | POST | Ejecuta `playactor wake` |
| `/api/standby` | POST | Ejecuta `playactor standby` |
| `/api/sleep-timer` | POST | Programa el reposo. Cuerpo: `{"minutes": 60}`. Con `0` cancela |

El estado se calcula con `playactor check` cada 20 segundos.

## Contribuir

Los cambios son bienvenidos. Si encuentras que `standby` funciona en otra versión de la PS5, o arreglas el inicio de juegos, cuéntalo en un issue o abre un pull request.

## Licencia

[MIT](LICENSE). Este proyecto no está afiliado a Sony Interactive Entertainment. Úsalo bajo tu propia responsabilidad.

---

## English quick start

A small web app that **wakes your PS5 from your phone**. A tiny Node server on a Mac/PC runs [playactor](https://github.com/dhleong/playactor) to talk to the console.

1. **PS5:** Settings > System > Power Saving > Features Available in Rest Mode: enable *Stay Connected to the Internet* and *Enable Turning On PS5 from Network*. Settings > System > Remote Play: enable it. Note the console's IP (Settings > Network > View Connection Status).
2. **Install** [Node.js](https://nodejs.org) (LTS) and run `npm install -g playactor`.
3. **Register** the console once: `playactor login`. Press Enter once, sign in to PlayStation in the browser, and when the page shows "redirect" paste the full URL into the terminal only while it is waiting for input. Then enter the 8-digit PIN from Settings > System > Remote Play > Link Device. If the login exits immediately on a very new Node, run it with Node 22: `npx -y node@22 "$(which playactor)" login`.
4. **Test:** put the PS5 in rest mode (orange light), then run `playactor wake --ip <PS5_IP>`.
5. **Run the server:** `PS5_IP=<PS5_IP> node server.js` (PowerShell: `$env:PS5_IP="<PS5_IP>"; node server.js`).
6. **Open** `http://<computer-ip>:3000` on your phone (same Wi-Fi) and add it to the home screen.

Wake works. The standby button and sleep timer depend on `playactor standby`, which some consoles reject (the console accepts the connection and closes it without acting). Starting games is not supported on PS5 by playactor. The server has no password: keep it on your home network and never expose it to the internet.

Not affiliated with Sony. MIT licensed.
